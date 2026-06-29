import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { DocumentFileUrlNotFoundException, DocumentIdNotFoundException, DocumentTitleNotFoundException } from "@document/domain/exceptions";
import { DocumentModel, RegisterDocumentModel, UpdateDocumentModel, FindDocumentsCriteria } from "@document/domain/models";
import { IDocumentRepository } from "@document/domain/ports/document.repository";

@Injectable()
export class PrismaDocumentService implements IDocumentRepository {
    constructor(private readonly prisma: PrismaService) { }

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

    async updateDocument(document: UpdateDocumentModel, id: string): Promise<string> {
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

    async getDocumentById(id: string): Promise<DocumentModel> {
        if (!id) {
            throw new DocumentIdNotFoundException();
        }

        const document = await this.prisma.document.findUnique({
            where: { id }
        });

        if (!document) {
            throw new DocumentIdNotFoundException();
        }

        return document;
    }

    async findDocumentsByUserId(userId: string, criteria: FindDocumentsCriteria): Promise<DocumentModel[]> {
        const { startDate, endDate, veterinarianName, documentName } = criteria;

        const whereClause: any = {
            medicalRecord: {
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
            if (startDate) dateFilter.gte = startDate;
            if (endDate) dateFilter.lte = endDate;
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

        return this.prisma.document.findMany({
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
    }
}

