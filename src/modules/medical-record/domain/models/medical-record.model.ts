import { MedicalRecordType } from "@medical-record/domain/enums";
import { VaccinationModel } from "@vaccination/domain/models";

export interface MedicalRecordModel {
    id: string;
    visitDate: Date;
    type: MedicalRecordType;
    reasonForVisit: string;
    diagnosis?: string;
    treatment?: string;
    notes?: string;
    createdAt: Date;
    petId: string;
    veterinarianId: string;
    ownerId: string;
    clinicId: string;
    documentIds?: string[];
    vaccinations?: VaccinationModel[];
}

export interface RegisterMedicalRecordModel {
    visitDate: Date;
    type: MedicalRecordType;
    reasonForVisit: string;
    diagnosis?: string;
    treatment?: string;
    notes?: string;
    petId: string;
    userId: string;
}
