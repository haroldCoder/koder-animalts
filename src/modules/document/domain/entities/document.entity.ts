export interface DocumentEntity {
    id: string;
    title: string;
    fileUrl: string;
    fileKey: string | null;
    fileSize: number | null;
    fileType: string | null;
    category: string | null;
    createdAt: Date;
    updatedAt: Date;
    petId: string | null;
    medicalRecordId: string | null;
    clinicId: string | null;
}
