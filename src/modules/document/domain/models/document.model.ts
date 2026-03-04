export interface DocumentModel {
    id: string;
    title: string;
    fileUrl: string;
    fileKey: string | null;
    fileSize: number | null;
    fileType: string | null;
    category: string | null;
    petId: string | null;
    clinicId: string | null;
    medicalRecordId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisterDocumentModel {
    title: string;
    fileUrl: string;
    fileKey?: string;
    fileSize?: number;
    fileType?: string;
    category?: string;
    petId?: string;
    clinicId?: string;
    medicalRecordId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UpdateDocumentModel extends Partial<RegisterDocumentModel> { }
