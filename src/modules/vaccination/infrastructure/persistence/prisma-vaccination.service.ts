import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { IVaccinationRepository } from "@vaccination/domain/ports";
import { CreateVaccinationModel, VaccinationModel } from "@vaccination/domain/models";
import { PetIdNotExistException } from "@/common/domain/exceptions";
import { VaccinationNameNotFoundException } from "@vaccination/domain/exceptions";
import { MedicalRecordVisitDateNotFoundException } from "@medical-record/domain/exceptions";

@Injectable()
export class PrismaVaccinationService implements IVaccinationRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateVaccinationModel): Promise<string> {
        const { vaccineName, medicalRecordId } = data;

        if (!vaccineName) throw new VaccinationNameNotFoundException();
        if (!medicalRecordId) throw new MedicalRecordVisitDateNotFoundException();

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
        return vaccinations as VaccinationModel[];
    }

    async findNextByPetId(petId: string): Promise<VaccinationModel | null> {
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
        return vaccination as VaccinationModel | null;
    }
}
