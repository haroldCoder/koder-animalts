import { VeterinarianIdNotFoundException } from "@/common/domain/exceptions";
import {
    VaccinationNameNotFoundException,
    VaccinationNotFoundException,
} from "../exceptions";
import { MedicalRecordVisitDateNotFoundException } from "@medical-record/domain/exceptions";

export class VaccinationEntity {
    private readonly id: string;
    private readonly vaccineName: string;
    private readonly dateAdministered: Date;
    private readonly nextDueDate: Date | null;
    private readonly lotNumber: string | null;
    private readonly medicalRecordId: string;
    private readonly createdAt: Date;
    private readonly petName: string | null;
    private readonly veterinarianId: string;

    private constructor(properties: {
        id: string;
        vaccineName: string;
        dateAdministered: Date;
        nextDueDate: Date | null;
        lotNumber: string | null;
        medicalRecordId: string;
        createdAt: Date;
        petName?: string | null;
        veterinarianId: string;
    }) {
        if (!properties.id) {
            throw new VaccinationNotFoundException();
        }
        if (!properties.vaccineName) {
            throw new VaccinationNameNotFoundException();
        }
        if (!properties.medicalRecordId) {
            throw new MedicalRecordVisitDateNotFoundException();
        }
        if (!properties.veterinarianId) {
            throw new VeterinarianIdNotFoundException();
        }

        this.id = properties.id;
        this.vaccineName = properties.vaccineName;
        this.dateAdministered = properties.dateAdministered;
        this.nextDueDate = properties.nextDueDate;
        this.lotNumber = properties.lotNumber;
        this.medicalRecordId = properties.medicalRecordId;
        this.createdAt = properties.createdAt;
        this.petName = properties.petName ?? null;
        this.veterinarianId = properties.veterinarianId;
    }

    public static create(properties: {
        id: string;
        vaccineName: string;
        dateAdministered?: Date;
        nextDueDate?: Date | null;
        lotNumber?: string | null;
        medicalRecordId: string;
        createdAt?: Date;
        petName?: string | null;
        veterinarianId: string;
    }): VaccinationEntity {
        return new VaccinationEntity({
            id: properties.id,
            vaccineName: properties.vaccineName,
            dateAdministered: properties.dateAdministered ?? new Date(),
            nextDueDate: properties.nextDueDate ?? null,
            lotNumber: properties.lotNumber ?? null,
            medicalRecordId: properties.medicalRecordId,
            createdAt: properties.createdAt ?? new Date(),
            petName: properties.petName,
            veterinarianId: properties.veterinarianId,
        });
    }

    // Getters
    public getId(): string { return this.id; }
    public getVaccineName(): string { return this.vaccineName; }
    public getDateAdministered(): Date { return this.dateAdministered; }
    public getNextDueDate(): Date | null { return this.nextDueDate; }
    public getLotNumber(): string | null { return this.lotNumber; }
    public getMedicalRecordId(): string { return this.medicalRecordId; }
    public getCreatedAt(): Date { return this.createdAt; }
    public getPetName(): string | null { return this.petName; }
    public getVeterinarianId(): string { return this.veterinarianId; }
}
