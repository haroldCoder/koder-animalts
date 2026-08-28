import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { DocumentFileUrlNotFoundException, DocumentIdNotFoundException, DocumentTitleNotFoundException } from "@document/domain/exceptions";
import { IDocumentRepository, FindDocumentsCriteria, UpdateDocumentFields } from "@document/domain/ports/document.repository";
import { DocumentEntity } from "@document/domain/entities";
import { RegisterDocumentModel } from "@/common/domain/models";

@Injectable()
export class PrismaDocumentService implements IDocumentRepository {
    constructor(private readonly prisma: PrismaService) { }

    private mapToDomain(document: any): DocumentEntity {
        return DocumentEntity.create({
            id: document.id,
            title: document.title,
            fileUrl: document.fileUrl,
            fileKey: document.fileKey,
            fileSize: document.fileSize,
            fileType: document.fileType,
            category: document.category,
            petId: document.petId,
            clinicId: document.clinicId,
            medicalRecordId: document.medicalRecordId,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        });
    }

    async registerDocument(document: RegisterDocumentModel): Promise<string> {
        const { title, fileUrl } = document;

        if (!title) {
            throw new DocumentTitleNotFoundException();
        }

        if (!fileUrl) {
            throw new DocumentFileUrlNotFoundException();
        }

        const { id } = await this.prisma.document.create({
            data: document
        });

        return id;
    }

    async updateDocument(document: UpdateDocumentFields, id: string): Promise<string> {
        if (!id) {
            throw new DocumentIdNotFoundException();
        }

        const { id: updatedId } = await this.prisma.document.update({
            where: { id },
            data: document
        });

        return updatedId;
    }

    async deleteDocument(id: string): Promise<string> {
        if (!id) {
            throw new DocumentIdNotFoundException();
        }

        const { id: deletedId } = await this.prisma.document.delete({
            where: { id }
        });

        return deletedId;
    }

    async getDocumentById(id: string): Promise<DocumentEntity> {
        if (!id) {
            throw new DocumentIdNotFoundException();
        }

        const document = await this.prisma.document.findUnique({
            where: { id }
        });

        if (!document) {
            throw new DocumentIdNotFoundException();
        }

        return this.mapToDomain(document);
    }

    async findDocumentsByUserId(userId: string, criteria: FindDocumentsCriteria): Promise<DocumentEntity[]> {
        const { startDate, endDate, veterinarianName, documentName, medicalRecordId } = criteria;

        const whereClause: any = {
            medicalRecord: medicalRecordId ? { id: medicalRecordId } : {
                OR: [
                    {
                        pet: {
                            owner: {
                                userId: userId,
                            },
                        },
                    },
                    {
                        veterinarian: {
                            userId: userId,
                        },
                    },
                ],
            },
        };

        if (startDate || endDate) {
            const dateFilter: any = {};
            // Normalize dates to avoid timezone off-by-one issues:
            // startDate → start of day UTC (00:00:00.000Z)
            // endDate   → end of day UTC (23:59:59.999Z)
            if (startDate) {
                const d = new Date(startDate);
                d.setUTCHours(0, 0, 0, 0);
                dateFilter.gte = d;
            }
            if (endDate) {
                const d = new Date(endDate);
                d.setUTCHours(23, 59, 59, 999);
                dateFilter.lte = d;
            }
            whereClause.createdAt = dateFilter;
        }

        if (documentName) {
            whereClause.title = {
                contains: documentName,
                mode: 'insensitive',
            };
        }

        if (veterinarianName) {
            whereClause.medicalRecord.veterinarian = {
                user: {
                    name: {
                        contains: veterinarianName,
                        mode: 'insensitive',
                    },
                },
            };
        }

        const documents = await this.prisma.document.findMany({
            where: whereClause,
            include: {
                medicalRecord: {
                    select: {
                        pet: {
                            select: {
                                name: true
                            }
                        },
                        veterinarian: {
                            select: {
                                user: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return documents.map((doc) => this.mapToDomain(doc));
    }
}
