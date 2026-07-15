import { MedicalRecordType } from "../enums";
import {
    MedicalRecordReasonForVisitNotFoundException,
    MedicalRecordTypeNotFoundException,
    MedicalRecordVisitDateNotFoundException,
} from "../exceptions";
import {
    MedicalRecordIdNotFoundException,
    PetIdNotFoundException,
    VeterinarianIdNotFoundException,
} from "@/common/domain/exceptions";
import { VaccinationModel } from "@vaccination/domain/models";

export class MedicalRecordEntity {
    private readonly id: string;
    private readonly visitDate: Date;
    private readonly type: MedicalRecordType;
    private readonly reasonForVisit: string;
    private readonly diagnosis: string;
    private readonly treatment: string;
    private readonly notes: string;
    private readonly createdAt: Date;
    private readonly petId: string;
    private readonly veterinarianId: string;
    private readonly ownerId: string;
    private readonly clinicId: string;
    private readonly documentIds: string[];
    private readonly vaccinations: VaccinationModel[];

    private constructor(properties: {
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
        ownerId?: string;
        clinicId?: string;
        documentIds?: string[];
        vaccinations?: VaccinationModel[];
    }) {
        if (!properties.id) {
            throw new MedicalRecordIdNotFoundException();
        }
        if (!properties.visitDate) {
            throw new MedicalRecordVisitDateNotFoundException();
        }
        if (!properties.type) {
            throw new MedicalRecordTypeNotFoundException();
        }
        if (!properties.reasonForVisit) {
            throw new MedicalRecordReasonForVisitNotFoundException();
        }
        if (!properties.petId) {
            throw new PetIdNotFoundException();
        }
        if (!properties.veterinarianId) {
            throw new VeterinarianIdNotFoundException();
        }

        this.id = properties.id;
        this.visitDate = properties.visitDate;
        this.type = properties.type;
        this.reasonForVisit = properties.reasonForVisit;
        this.diagnosis = properties.diagnosis ?? "";
        this.treatment = properties.treatment ?? "";
        this.notes = properties.notes ?? "";
        this.createdAt = properties.createdAt;
        this.petId = properties.petId;
        this.veterinarianId = properties.veterinarianId;
        this.ownerId = properties.ownerId ?? "";
        this.clinicId = properties.clinicId ?? "";
        this.documentIds = properties.documentIds ?? [];
        this.vaccinations = properties.vaccinations ?? [];
    }

    public static create(properties: {
        id: string;
        visitDate: Date;
        type: MedicalRecordType;
        reasonForVisit: string;
        diagnosis?: string;
        treatment?: string;
        notes?: string;
        createdAt?: Date;
        petId: string;
        veterinarianId: string;
        ownerId?: string;
        clinicId?: string;
        documentIds?: string[];
        vaccinations?: VaccinationModel[];
    }): MedicalRecordEntity {
        return new MedicalRecordEntity({
            id: properties.id,
            visitDate: properties.visitDate,
            type: properties.type,
            reasonForVisit: properties.reasonForVisit,
            diagnosis: properties.diagnosis,
            treatment: properties.treatment,
            notes: properties.notes,
            createdAt: properties.createdAt ?? new Date(),
            petId: properties.petId,
            veterinarianId: properties.veterinarianId,
            ownerId: properties.ownerId,
            clinicId: properties.clinicId,
            documentIds: properties.documentIds,
            vaccinations: properties.vaccinations,
        });
    }

    // Getters
    public getId(): string { return this.id; }
    public getVisitDate(): Date { return this.visitDate; }
    public getType(): MedicalRecordType { return this.type; }
    public getReasonForVisit(): string { return this.reasonForVisit; }
    public getDiagnosis(): string { return this.diagnosis; }
    public getTreatment(): string { return this.treatment; }
    public getNotes(): string { return this.notes; }
    public getCreatedAt(): Date { return this.createdAt; }
    public getPetId(): string { return this.petId; }
    public getVeterinarianId(): string { return this.veterinarianId; }
    public getOwnerId(): string { return this.ownerId; }
    public getClinicId(): string { return this.clinicId; }
    public getDocumentIds(): string[] { return this.documentIds; }
    public getVaccinations(): VaccinationModel[] { return this.vaccinations; }
}
