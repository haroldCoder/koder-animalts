import { RegisterDocumentModel } from "@/common/domain/models";
import { MedicalRecordModel, RegisterMedicalRecordModel } from "@medical-record/domain/models";

export interface MedicalRecordRepository {
    create(data: RegisterMedicalRecordModel): Promise<void>;
    findById(id: string): Promise<MedicalRecordModel | null>;
    uploadDocumentToMedicalRecord(medicalRecordId: string, documents: RegisterDocumentModel[]): Promise<void>;
}
