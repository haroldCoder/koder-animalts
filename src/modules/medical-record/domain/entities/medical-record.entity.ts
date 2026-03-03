import { MedicalRecordType } from "@medical-record/domain/enums";
import { VaccinationModel } from "@vaccination/domain/models";


export interface MedicalRecordEntity {
    id: string;
    visitDate: Date;
    type: MedicalRecordType;
    reasonForVisit: string;
    diagnosis: string;
    treatment: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    petId: string;
    veterinarianId: string;
    vaccinations?: VaccinationModel[];

}