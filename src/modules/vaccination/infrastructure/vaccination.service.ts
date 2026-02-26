import { PrismaService } from "@/common/infrastructure/db";
import { Injectable } from "@nestjs/common";
import { RegisterVaccinationDto } from "./dto";
import { ResponseDto } from "@/common/domain/dto/response.dto";
import { ServerErrorException } from "@/common/domain/exceptions";
import { VaccinationEntity } from "@vaccination/domain/entities";

@Injectable()
export class VaccinationService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async registerVaccination(dto: RegisterVaccinationDto): Promise<ResponseDto<string>> {
        try {
            await this.prisma.vaccination.create({
                data: {
                    vaccineName: dto.vaccineName,
                    dateAdministered: dto.dateAdministered || new Date(),
                    nextDueDate: dto.nextDueDate,
                    lotNumber: dto.lotNumber,
                    medicalRecordId: dto.medicalRecordId,
                },
            });

            return {
                statusCode: 201,
                message: 'Vaccination registered successfully',
            };
        } catch (error) {
            throw new ServerErrorException("Failed to register vaccination");
        }
    }

    async getUpcomingVaccinationsByPetId(petId: string): Promise<ResponseDto<VaccinationEntity[]>> {
        try {
            const vaccinations = await this.prisma.vaccination.findMany({
                where: {
                    medicalRecord: {
                        petId: petId
                    }
                },
                orderBy: {
                    nextDueDate: 'asc'
                }
            });

            return {
                statusCode: 200,
                data: vaccinations as VaccinationEntity[],
            };
        } catch (error) {
            throw new ServerErrorException("Failed to retrieve upcoming vaccinations");
        }
    }

    async getVaccinationsByMedicalRecordId(medicalRecordId: string): Promise<VaccinationEntity[]> {
        const vaccinations = await this.prisma.vaccination.findMany({
            where: { medicalRecordId },
        });
        return vaccinations as VaccinationEntity[];
    }

    async getNextVaccinationReminder(petId: string): Promise<ResponseDto<VaccinationEntity | null>> {
        try {
            const nextVaccination = await this.prisma.vaccination.findFirst({
                where: {
                    medicalRecord: {
                        petId: petId
                    },
                },
                orderBy: {
                    nextDueDate: 'asc'
                }
            });

            return {
                statusCode: 200,
                data: nextVaccination as VaccinationEntity | null,
            };
        } catch (error) {
            throw new ServerErrorException("Failed to retrieve next vaccination reminder");
        }
    }
}
