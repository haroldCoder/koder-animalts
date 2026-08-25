import {
    DocumentFileUrlNotFoundException,
    DocumentIdNotFoundException,
    DocumentTitleNotFoundException,
} from "../exceptions";

export class DocumentEntity {
    private readonly id: string;
    private readonly title: string;
    private readonly fileUrl: string;
    private readonly fileKey: string | null;
    private readonly fileSize: number | null;
    private readonly fileType: string | null;
    private readonly category: string | null;
    private readonly petId: string | null;
    private readonly clinicId: string | null;
    private readonly medicalRecordId: string | null;
    private readonly createdAt: Date;
    private readonly updatedAt: Date;

    private constructor(properties: {
        id: string;
        title: string;
        fileUrl: string;
        fileKey?: string | null;
        fileSize?: number | null;
        fileType?: string | null;
        category?: string | null;
        petId?: string | null;
        clinicId?: string | null;
        medicalRecordId?: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) {
        if (!properties.id) {
            throw new DocumentIdNotFoundException();
        }
        if (!properties.title) {
            throw new DocumentTitleNotFoundException();
        }
        if (!properties.fileUrl) {
            throw new DocumentFileUrlNotFoundException();
        }

        this.id = properties.id;
        this.title = properties.title;
        this.fileUrl = properties.fileUrl;
        this.fileKey = properties.fileKey ?? null;
        this.fileSize = properties.fileSize ?? null;
        this.fileType = properties.fileType ?? null;
        this.category = properties.category ?? null;
        this.petId = properties.petId ?? null;
        this.clinicId = properties.clinicId ?? null;
        this.medicalRecordId = properties.medicalRecordId ?? null;
        this.createdAt = properties.createdAt;
        this.updatedAt = properties.updatedAt;
    }

    public static create(properties: {
        id: string;
        title: string;
        fileUrl: string;
        fileKey?: string | null;
        fileSize?: number | null;
        fileType?: string | null;
        category?: string | null;
        petId?: string | null;
        clinicId?: string | null;
        medicalRecordId?: string | null;
        createdAt?: Date;
        updatedAt?: Date;
    }): DocumentEntity {
        const now = new Date();
        return new DocumentEntity({
            id: properties.id,
            title: properties.title,
            fileUrl: properties.fileUrl,
            fileKey: properties.fileKey,
            fileSize: properties.fileSize,
            fileType: properties.fileType,
            category: properties.category,
            petId: properties.petId,
            clinicId: properties.clinicId,
            medicalRecordId: properties.medicalRecordId,
            createdAt: properties.createdAt ?? now,
            updatedAt: properties.updatedAt ?? now,
        });
    }

    // Getters
    public getId(): string { return this.id; }
    public getTitle(): string { return this.title; }
    public getFileUrl(): string { return this.fileUrl; }
    public getFileKey(): string | null { return this.fileKey; }
    public getFileSize(): number | null { return this.fileSize; }
    public getFileType(): string | null { return this.fileType; }
    public getCategory(): string | null { return this.category; }
    public getPetId(): string | null { return this.petId; }
    public getClinicId(): string | null { return this.clinicId; }
    public getMedicalRecordId(): string | null { return this.medicalRecordId; }
    public getCreatedAt(): Date { return this.createdAt; }
    public getUpdatedAt(): Date { return this.updatedAt; }
}
