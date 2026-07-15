import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { MedicalRecordRepository } from "@medical-record/domain/ports";
import { MedicalRecordModel, RegisterMedicalRecordModel } from "@medical-record/domain/models";
import { MedicalRecordType } from "@medical-record/domain/enums";
import { PetIdNotFoundException, UserIdNotFoundException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";
import { MedicalRecordReasonForVisitNotFoundException, MedicalRecordTypeNotFoundException, MedicalRecordVisitDateNotFoundException } from "@medical-record/domain/exceptions";
import type { IPetRepository } from "@pet/domain/ports";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import type { IDocumentRepository } from "@document/domain/ports/document.repository";
import { sleep } from "@/common/infrastructure/utils";
import { RegisterDocumentModel } from "@/common/domain/models";
import { DocumentIdNotFoundException } from "@document/domain/exceptions";
import { MedicalRecordIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class PrismaMedicalRecordService implements MedicalRecordRepository {
    constructor(
        private readonly prisma: PrismaService,
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository,
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository,
        @Inject("IDocumentRepository")
        private readonly documentRepository: IDocumentRepository,
    ) { }


    async create(data: RegisterMedicalRecordModel): Promise<void> {
        const { petId, userId, type, reasonForVisit, visitDate } = data;

        if (!petId) throw new PetIdNotFoundException();
        if (!userId) throw new UserIdNotFoundException();
        if (!type) throw new MedicalRecordTypeNotFoundException();
        if (!reasonForVisit) throw new MedicalRecordReasonForVisitNotFoundException();
        if (!visitDate) throw new MedicalRecordVisitDateNotFoundException();

        const pet = await this.petRepository.findById(petId);
        if (!pet) throw new PetIdNotFoundException();

        const veterinarian = await this.veterinarianRepository.findByUserId(userId);
        if (!veterinarian) throw new VeterinarianIdNotFoundException();

        await this.prisma.medicalRecord.create({
            data: {
                petId,
                type,
                reasonForVisit,
                visitDate,
                diagnosis: data.diagnosis || "",
                treatment: data.treatment || "",
                notes: data.notes || "",
                veterinarianId: veterinarian.getId()
            }
        });
    }

    async findById(id: string): Promise<MedicalRecordModel | null> {
        const medicalRecord = await this.prisma.medicalRecord.findUnique({
            where: { id },
            include: {
                vaccinations: true,
                pet: {
                    select: {
                        id: true,
                        name: true,
                        mainImage: true,
                        owner: {
                            select: {
                                id: true,
                                user: {
                                    select:
                                    {
                                        id: true,
                                        name: true,
                                    }
                                }
                            }
                        }
                    }
                },
                veterinarian: {
                    select: {
                        id: true,
                        user: { select: { name: true } },
                        clinic: { select: { id: true, name: true } },
                    },
                },
            },
        });

        if (!medicalRecord) return null;

        return {
            ...medicalRecord,
            type: medicalRecord.type as MedicalRecordType,
            diagnosis: medicalRecord.diagnosis || "",
            treatment: medicalRecord.treatment || "",
            notes: medicalRecord.notes || "",
            ownerId: medicalRecord.pet.owner?.id || "",
            clinicId: medicalRecord.veterinarian?.clinic?.id || "",
        };
    }

    async uploadDocumentToMedicalRecord(medicalRecordId: string, documents: RegisterDocumentModel[]): Promise<void> {
        if (!medicalRecordId) throw new MedicalRecordVisitDateNotFoundException();
        if (!documents) throw new DocumentIdNotFoundException();

        const medicalRecord = await this.findById(medicalRecordId);
        if (!medicalRecord) throw new MedicalRecordIdNotFoundException();

        let veterinaryClinic: { id: string, name: string } | null = null;
        if (medicalRecord.veterinarianId) {
            veterinaryClinic = await this.veterinarianRepository.findClinicByVeterinarianId(medicalRecord.veterinarianId);
        }

        for (const document of documents) {
            await this.documentRepository.registerDocument({
                ...document,
                medicalRecordId,
                petId: medicalRecord.petId,
                ...(veterinaryClinic && { clinicId: veterinaryClinic.id }),
            });
            await sleep(500);
        }
    }

    async findByVeterinarianId(veterinarianId: string): Promise<MedicalRecordModel[] | null> {
        if (!veterinarianId) throw new VeterinarianIdNotFoundException();

        const medicalRecords = await this.prisma.medicalRecord.findMany({
            where: { veterinarianId },
            include: {
                vaccinations: true,
                pet: {
                    select: {
                        id: true,
                        name: true,
                        mainImage: true,
                        owner: {
                            select: {
                                id: true,
                                user: {
                                    select:
                                    {
                                        id: true,
                                        name: true,
                                    }
                                }
                            }
                        }
                    }
                },
                veterinarian: {
                    select: {
                        id: true,
                        user: { select: { name: true } },
                        clinic: { select: { id: true, name: true } },
                    },
                },
            },
        });

        if (!medicalRecords) return null;

        return medicalRecords.map((medicalRecord) => ({
            ...medicalRecord,
            type: medicalRecord.type as MedicalRecordType,
            diagnosis: medicalRecord.diagnosis || "",
            treatment: medicalRecord.treatment || "",
            notes: medicalRecord.notes || "",
            ownerId: medicalRecord.pet.owner?.id || "",
            clinicId: medicalRecord.veterinarian?.clinic?.id || "",
        }));
    }

    async findByPetId(petId: string): Promise<MedicalRecordModel[] | null> {
        if (!petId) throw new PetIdNotFoundException();

        const medicalRecords = await this.prisma.medicalRecord.findMany({
            where: { petId },
            include: {
                vaccinations: true,
                pet: {
                    select: {
                        id: true,
                        name: true,
                        mainImage: true,
                        owner: {
                            select: {
                                id: true,
                                user: {
                                    select:
                                    {
                                        id: true,
                                        name: true,
                                    }
                                }
                            }
                        }
                    }
                },
                veterinarian: {
                    select: {
                        id: true,
                        user: { select: { name: true } },
                        clinic: { select: { id: true, name: true } },
                    },
                },
            },
        });

        if (!medicalRecords) return null;

        return medicalRecords.map((medicalRecord) => ({
            ...medicalRecord,
            type: medicalRecord.type as MedicalRecordType,
            diagnosis: medicalRecord.diagnosis || "",
            treatment: medicalRecord.treatment || "",
            notes: medicalRecord.notes || "",
            ownerId: medicalRecord.pet.owner.id || "",
            clinicId: medicalRecord.veterinarian?.clinic?.id || "",
        }));
    }

    async findByUserId(userId: string, medicalRecordId?: string): Promise<MedicalRecordModel[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { owner: true, veterinarian: true },
        });

        if (!user) throw new UserIdNotFoundException();

        let petFilter: { ownerId?: string; clinicId?: string } = {};

        if (user.owner) {
            petFilter = { ownerId: user.owner.id };
        } else if (user.veterinarian) {
            petFilter = { clinicId: user.veterinarian.clinicId };
        } else {
            return [];
        }

        const medicalRecords = await this.prisma.medicalRecord.findMany({
            where: {
                pet: petFilter,
                ...(medicalRecordId ? { id: medicalRecordId } : {}),
            },
            include: {
                vaccinations: true,
                documents: {
                    select: {
                        id: true,
                    }
                },
                pet: {
                    select: {
                        id: true,
                        name: true,
                        mainImage: true,
                        owner: {
                            select: {
                                id: true,
                                user: {
                                    select:
                                    {
                                        id: true,
                                        name: true,
                                    }
                                }
                            }
                        }
                    }
                },
                veterinarian: {
                    select: {
                        id: true,
                        user: { select: { name: true } },
                        clinic: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: {
                visitDate: "desc",
            },
        });

        return medicalRecords.map((medicalRecord) => ({
            ...medicalRecord,
            type: medicalRecord.type as MedicalRecordType,
            diagnosis: medicalRecord.diagnosis || "",
            treatment: medicalRecord.treatment || "",
            notes: medicalRecord.notes || "",
            ownerId: medicalRecord.pet.owner.id || "",
            clinicId: medicalRecord.veterinarian?.clinic?.id || "",
            documentIds: medicalRecord.documents.map((document) => document.id),
        }));
    }
}
