import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { IVaccinationRepository } from "@vaccination/domain/ports";
import { CreateVaccinationModel, VaccinationModel } from "@vaccination/domain/models";

@Injectable()
export class PrismaVaccinationService implements IVaccinationRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateVaccinationModel): Promise<string> {
        const { id } = await this.prisma.vaccination.create({
            data: {
                vaccineName: data.vaccineName,
                dateAdministered: data.dateAdministered ?? new Date(),
                nextDueDate: data.nextDueDate,
                lotNumber: data.lotNumber,
                medicalRecordId: data.medicalRecordId,
            },
        });
        return id;
    }

    async findUpcomingByPetId(petId: string): Promise<VaccinationModel[]> {
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
        return vaccinations as VaccinationModel[];
    }

    async findNextByPetId(petId: string): Promise<VaccinationModel | null> {
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
        return vaccination as VaccinationModel | null;
    }
}
