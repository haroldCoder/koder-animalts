import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { IVaccinationRepository, FindVaccinationsCriteria } from "@vaccination/domain/ports";
import { VaccinationEntity } from "@vaccination/domain/entities";
import { PetIdNotExistException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { ResponseVaccinationDto } from "@vaccination/domain/dtos";
import { normalizeEndDate, normalizeStartDAte } from "@/common/utils";

@Injectable()
export class PrismaVaccinationService implements IVaccinationRepository {
    constructor(private readonly prisma: PrismaService) { }

    private mapToDomain(vaccination: any): VaccinationEntity {
        return VaccinationEntity.create({
            id: vaccination.id,
            vaccineName: vaccination.vaccineName,
            dateAdministered: vaccination.dateAdministered,
            nextDueDate: vaccination.nextDueDate,
            lotNumber: vaccination.lotNumber,
            medicalRecordId: vaccination.medicalRecordId,
            createdAt: vaccination.createdAt,
            petName: vaccination.medicalRecord?.pet?.name || null,
            veterinarianId: vaccination.veterinarian.id,
        });
    }

    mapToResponse(vaccination: any): ResponseVaccinationDto {
        return {
            id: vaccination.id,
            vaccineName: vaccination.vaccineName,
            dateAdministered: vaccination.dateAdministered,
            nextDueDate: vaccination.nextDueDate,
            lotNumber: vaccination.lotNumber,
            createdAt: vaccination.createdAt,
            medicalRecordId: vaccination.medicalRecordId,
            medicalRecord: {
                pet: {
                    name: vaccination.medicalRecord?.pet?.name || null,
                }
            },
            veterinarian: {
                id: vaccination.veterinarian.id,
                name: vaccination.veterinarian.user?.name,
            }
        };
    }

    async create(vaccination: VaccinationEntity): Promise<string> {
        const { id } = await this.prisma.vaccination.create({
            data: {
                id: vaccination.getId(),
                vaccineName: vaccination.getVaccineName(),
                dateAdministered: vaccination.getDateAdministered(),
                nextDueDate: vaccination.getNextDueDate(),
                lotNumber: vaccination.getLotNumber(),
                medicalRecordId: vaccination.getMedicalRecordId(),
                veterinarianId: vaccination.getVeterinarianId(),
            },
        });
        return id;
    }

    async findUpcomingByPetId(petId: string): Promise<VaccinationEntity[]> {
        if (!petId) throw new PetIdNotExistException();

        const vaccinations = await this.prisma.vaccination.findMany({
            where: {
                medicalRecord: {
                    petId,
                },
            },
            orderBy: {
                nextDueDate: "asc",
            },
        });
        return vaccinations.map((vaccination) => this.mapToDomain(vaccination));
    }

    async findNextByPetId(petId: string): Promise<VaccinationEntity | null> {
        if (!petId) throw new PetIdNotExistException();

        const vaccination = await this.prisma.vaccination.findFirst({
            where: {
                medicalRecord: {
                    petId,
                },
            },
            orderBy: {
                nextDueDate: "asc",
            },
        });
        if (!vaccination) return null;
        return this.mapToDomain(vaccination);
    }

    async findByUserId(userId: string, criteria: FindVaccinationsCriteria): Promise<ResponseVaccinationDto[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) throw new UserIdNotFoundException();

        const { page, limit, medicalRecordId, petId, startDate, endDate } = criteria;
        const skip = page && limit ? (page - 1) * limit : undefined;
        const take = limit ? limit : undefined;

        const normalizedStartDate = startDate ? normalizeStartDAte(startDate) : undefined;
        const normalizedEndDate = endDate ? normalizeEndDate(endDate) : undefined;

        const dateFilter = (normalizedStartDate || normalizedEndDate) ? [
            {
                OR: [
                    {
                        dateAdministered: {
                            ...(normalizedStartDate && { gte: normalizedStartDate }),
                            ...(normalizedEndDate && { lte: normalizedEndDate }),
                        },
                    },
                    {
                        nextDueDate: {
                            ...(normalizedStartDate && { gte: normalizedStartDate }),
                            ...(normalizedEndDate && { lte: normalizedEndDate }),
                        },
                    },
                ],
            },
        ] : [];

        const vaccinations = await this.prisma.vaccination.findMany({
            where: {
                ...(medicalRecordId && { medicalRecordId }),
                AND: [
                    {
                        OR: [
                            {
                                medicalRecord: {
                                    pet: {
                                        owner: {
                                            userId,
                                        },
                                        ...(petId && { id: petId })
                                    }
                                }
                            },
                            {
                                veterinarian: {
                                    userId,
                                }
                            },
                        ]
                    },
                    ...dateFilter,
                ]
            },
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
                                id: true,
                                user: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                veterinarian: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            skip,
            take,
            orderBy: {
                createdAt: "desc",
            },
        });

        return vaccinations.map((vaccination) => this.mapToResponse(vaccination));
    }
}
