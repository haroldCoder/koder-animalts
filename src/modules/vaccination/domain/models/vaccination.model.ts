import { PartialType } from "@nestjs/mapped-types";

export class VaccinationModel {
    id: string;
    vaccineName: string;
    dateAdministered: Date;
    nextDueDate: Date | null;
    lotNumber: string | null;
    medicalRecordId: string;
    createdAt: Date;
}

export class CreateVaccinationModel {
    vaccineName: string;
    dateAdministered?: Date;
    nextDueDate?: Date | null;
    lotNumber?: string | null;
    medicalRecordId: string;
}

export class UpdateVaccinationModel extends PartialType(CreateVaccinationModel) { }
