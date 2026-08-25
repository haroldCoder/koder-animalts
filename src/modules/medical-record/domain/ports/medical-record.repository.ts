import { RegisterDocumentModel } from "@/common/domain/models";
import { MedicalRecordEntity } from "@medical-record/domain/entities";

export interface MedicalRecordRepository {
    create(medicalRecord: MedicalRecordEntity): Promise<void>;
    findById(id: string): Promise<MedicalRecordEntity | null>;
    uploadDocumentToMedicalRecord(medicalRecordId: string, documents: RegisterDocumentModel[]): Promise<void>;
    findByVeterinarianId(veterinarianId: string): Promise<MedicalRecordEntity[] | null>;
    findByPetId(petId: string): Promise<MedicalRecordEntity[] | null>;
    findByUserId(userId: string, medicalRecordId?: string, petId?: string, startDate?: Date, endDate?: Date): Promise<MedicalRecordEntity[]>;
}
