import { DocumentEntity } from "@document/domain/entities";
import { RegisterDocumentModel } from "@/common/domain/models";

export interface FindDocumentsCriteria {
    startDate?: Date;
    endDate?: Date;
    veterinarianName?: string;
    documentName?: string;
    medicalRecordId?: string;
}

export interface UpdateDocumentFields {
    title?: string;
    fileUrl?: string;
    fileKey?: string;
    fileSize?: number;
    fileType?: string;
    category?: string;
    petId?: string;
    clinicId?: string;
    medicalRecordId?: string;
}

export interface IDocumentRepository {
    registerDocument(document: RegisterDocumentModel): Promise<string>;
    updateDocument(document: UpdateDocumentFields, id: string): Promise<string>;
    deleteDocument(id: string): Promise<string>;
    getDocumentById(id: string): Promise<DocumentEntity>;
    findDocumentsByUserId(userId: string, criteria: FindDocumentsCriteria): Promise<DocumentEntity[]>;
}