import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { MedicalRecordRepository } from "@medical-record/domain/ports";
import { MedicalRecordEntity } from "@medical-record/domain/entities";
import { MedicalRecordType } from "@medical-record/domain/enums";

import { MedicalRecordVisitDateNotFoundException } from "@medical-record/domain/exceptions";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import type { IDocumentRepository } from "@document/domain/ports/document.repository";
import { sleep } from "@/common/infrastructure/utils";
import { RegisterDocumentModel } from "@/common/domain/models";
import { MedicalRecordIdNotFoundException, PetIdNotFoundException, VeterinarianIdNotFoundException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { DocumentIdNotFoundException } from "@document/domain/exceptions";

interface ExtendedMedicalRecordEntity extends MedicalRecordEntity {
    pet: {
        id: string,
        name: string,
        mainImage: string,
        owner?: {
            id: string,
            user: {
                name: string
            }
        }
    },
    veterinarian: {
        id: string,
        user: {
            name: string
        },
        clinic: {
            name: string
            id: string
        }
    };
}

@Injectable()
export class PrismaMedicalRecordService implements MedicalRecordRepository {
    constructor(
        private readonly prisma: PrismaService,
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository,
        @Inject("IDocumentRepository")
        private readonly documentRepository: IDocumentRepository,
    ) { }

    private mapToDomain(medicalRecord: any): MedicalRecordEntity {
        return MedicalRecordEntity.create({
            id: medicalRecord.id,
            visitDate: medicalRecord.visitDate,
            type: medicalRecord.type as MedicalRecordType,
            reasonForVisit: medicalRecord.reasonForVisit,
            diagnosis: medicalRecord.diagnosis || "",
            treatment: medicalRecord.treatment || "",
            notes: medicalRecord.notes || "",
            createdAt: medicalRecord.createdAt,
            petId: medicalRecord.petId,
            veterinarianId: medicalRecord.veterinarianId,
            ownerId: medicalRecord.pet?.owner?.id || "",
            clinicId: medicalRecord.veterinarian?.clinic?.id || "",
            documentIds: medicalRecord.documents?.map((doc: any) => doc.id) ?? [],
            vaccinations: medicalRecord.vaccinations ?? [],
        });
    }

    async create(medicalRecord: MedicalRecordEntity): Promise<void> {
        await this.prisma.medicalRecord.create({
            data: {
                id: medicalRecord.getId(),
                petId: medicalRecord.getPetId(),
                type: medicalRecord.getType(),
                reasonForVisit: medicalRecord.getReasonForVisit(),
                visitDate: medicalRecord.getVisitDate(),
                diagnosis: medicalRecord.getDiagnosis() || "",
                treatment: medicalRecord.getTreatment() || "",
                notes: medicalRecord.getNotes() || "",
                veterinarianId: medicalRecord.getVeterinarianId()
            }
        });
    }

    async findById(id: string): Promise<MedicalRecordEntity | null> {
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

        return this.mapToDomain(medicalRecord);
    }

    async uploadDocumentToMedicalRecord(medicalRecordId: string, documents: RegisterDocumentModel[]): Promise<void> {
        if (!medicalRecordId) throw new MedicalRecordVisitDateNotFoundException();
        if (!documents) throw new DocumentIdNotFoundException();

        const medicalRecord = await this.findById(medicalRecordId);
        if (!medicalRecord) throw new MedicalRecordIdNotFoundException();

        let veterinaryClinic: { id: string, name: string } | null = null;
        if (medicalRecord.getVeterinarianId()) {
            veterinaryClinic = await this.veterinarianRepository.findClinicByVeterinarianId(medicalRecord.getVeterinarianId());
        }

        for (const document of documents) {
            await this.documentRepository.registerDocument({
                ...document,
                medicalRecordId,
                petId: medicalRecord.getPetId(),
                ...(veterinaryClinic && { clinicId: veterinaryClinic.id }),
            });
            await sleep(500);
        }
    }

    async findByVeterinarianId(veterinarianId: string): Promise<MedicalRecordEntity[] | null> {
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

        return medicalRecords.map((medicalRecord) => this.mapToDomain(medicalRecord));
    }

    async findByPetId(petId: string): Promise<MedicalRecordEntity[] | null> {
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

        return medicalRecords.map((medicalRecord) => this.mapToDomain(medicalRecord));
    }

    async findByUserId(userId: string, medicalRecordId?: string): Promise<ExtendedMedicalRecordEntity[]> {
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

        return medicalRecords.map((medicalRecord) => {
            const pet = medicalRecord.pet;
            const veterinarian = medicalRecord.veterinarian;
            return Object.assign(this.mapToDomain(medicalRecord), {
                pet: {
                    id: pet.id,
                    name: pet.name,
                    mainImage: pet.mainImage,
                    owner: pet.owner ? {
                        id: pet.owner.id,
                        user: {
                            id: pet.owner.user.id,
                            name: pet.owner.user.name ?? "",
                        }
                    } : undefined
                },
                veterinarian: {
                    id: veterinarian.id,
                    user: {
                        name: veterinarian.user.name ?? "",
                    },
                    clinic: {
                        id: veterinarian.clinic?.id ?? "",
                        name: veterinarian.clinic?.name ?? "",
                    }
                }
            }) as ExtendedMedicalRecordEntity;
        });
    }
}
