import { PetIdNotFoundException } from "@/common/domain/exceptions";
import { PetBackgroundIdNotFoundException } from "../exceptions";

export class PetBackgroundEntity {
    private readonly id: string;
    private readonly petId: string;
    private provenance: string | null;
    private dietType: string | null;
    private dietDetails: string | null;
    private isNeutered: boolean;
    private neuteredDate: Date | null;
    private previousIllnesses: string | null;
    private hasAllergies: boolean;
    private allergiesDescription: string | null;
    private lastVaccinationDate: Date | null;
    private coreVaccines: any | null;
    private lastDewormingInternal: Date | null;
    private lastDewormingExternal: Date | null;
    private otherPreventiveNotes: string | null;
    private readonly createdAt: Date;
    private updatedAt: Date;

    private constructor(properties: {
        id: string;
        petId: string;
        provenance: string | null;
        dietType: string | null;
        dietDetails: string | null;
        isNeutered: boolean;
        neuteredDate: Date | null;
        previousIllnesses: string | null;
        hasAllergies: boolean;
        allergiesDescription: string | null;
        lastVaccinationDate: Date | null;
        coreVaccines: any | null;
        lastDewormingInternal: Date | null;
        lastDewormingExternal: Date | null;
        otherPreventiveNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) {
        if (!properties.id) {
            throw new PetBackgroundIdNotFoundException();
        }
        if (!properties.petId) {
            throw new PetIdNotFoundException();
        }

        this.id = properties.id;
        this.petId = properties.petId;
        this.provenance = properties.provenance ?? null;
        this.dietType = properties.dietType ?? null;
        this.dietDetails = properties.dietDetails ?? null;
        this.isNeutered = properties.isNeutered ?? false;
        this.neuteredDate = properties.neuteredDate ?? null;
        this.previousIllnesses = properties.previousIllnesses ?? null;
        this.hasAllergies = properties.hasAllergies ?? false;
        this.allergiesDescription = properties.allergiesDescription ?? null;
        this.lastVaccinationDate = properties.lastVaccinationDate ?? null;
        this.coreVaccines = properties.coreVaccines ?? null;
        this.lastDewormingInternal = properties.lastDewormingInternal ?? null;
        this.lastDewormingExternal = properties.lastDewormingExternal ?? null;
        this.otherPreventiveNotes = properties.otherPreventiveNotes ?? null;
        this.createdAt = properties.createdAt;
        this.updatedAt = properties.updatedAt;
    }

    public static create(properties: {
        id: string;
        petId: string;
        provenance?: string | null;
        dietType?: string | null;
        dietDetails?: string | null;
        isNeutered?: boolean;
        neuteredDate?: Date | null;
        previousIllnesses?: string | null;
        hasAllergies?: boolean;
        allergiesDescription?: string | null;
        lastVaccinationDate?: Date | null;
        coreVaccines?: any | null;
        lastDewormingInternal?: Date | null;
        lastDewormingExternal?: Date | null;
        otherPreventiveNotes?: string | null;
        createdAt?: Date;
        updatedAt?: Date;
    }): PetBackgroundEntity {
        return new PetBackgroundEntity({
            id: properties.id,
            petId: properties.petId,
            provenance: properties.provenance ?? null,
            dietType: properties.dietType ?? null,
            dietDetails: properties.dietDetails ?? null,
            isNeutered: properties.isNeutered ?? false,
            neuteredDate: properties.neuteredDate ?? null,
            previousIllnesses: properties.previousIllnesses ?? null,
            hasAllergies: properties.hasAllergies ?? false,
            allergiesDescription: properties.allergiesDescription ?? null,
            lastVaccinationDate: properties.lastVaccinationDate ?? null,
            coreVaccines: properties.coreVaccines ?? null,
            lastDewormingInternal: properties.lastDewormingInternal ?? null,
            lastDewormingExternal: properties.lastDewormingExternal ?? null,
            otherPreventiveNotes: properties.otherPreventiveNotes ?? null,
            createdAt: properties.createdAt ?? new Date(),
            updatedAt: properties.updatedAt ?? new Date(),
        });
    }

    // Getters
    public getId(): string { return this.id; }
    public getPetId(): string { return this.petId; }
    public getProvenance(): string | null { return this.provenance; }
    public getDietType(): string | null { return this.dietType; }
    public getDietDetails(): string | null { return this.dietDetails; }
    public getIsNeutered(): boolean { return this.isNeutered; }
    public getNeuteredDate(): Date | null { return this.neuteredDate; }
    public getPreviousIllnesses(): string | null { return this.previousIllnesses; }
    public getHasAllergies(): boolean { return this.hasAllergies; }
    public getAllergiesDescription(): string | null { return this.allergiesDescription; }
    public getLastVaccinationDate(): Date | null { return this.lastVaccinationDate; }
    public getCoreVaccines(): any | null { return this.coreVaccines; }
    public getLastDewormingInternal(): Date | null { return this.lastDewormingInternal; }
    public getLastDewormingExternal(): Date | null { return this.lastDewormingExternal; }
    public getOtherPreventiveNotes(): string | null { return this.otherPreventiveNotes; }
    public getCreatedAt(): Date { return this.createdAt; }
    public getUpdatedAt(): Date { return this.updatedAt; }

    // State change actions
    public updateDetails(properties: {
        provenance?: string | null;
        dietType?: string | null;
        dietDetails?: string | null;
        isNeutered?: boolean;
        neuteredDate?: Date | null;
        previousIllnesses?: string | null;
        hasAllergies?: boolean;
        allergiesDescription?: string | null;
        lastVaccinationDate?: Date | null;
        coreVaccines?: any | null;
        lastDewormingInternal?: Date | null;
        lastDewormingExternal?: Date | null;
        otherPreventiveNotes?: string | null;
    }): void {
        if (properties.provenance !== undefined) this.provenance = properties.provenance;
        if (properties.dietType !== undefined) this.dietType = properties.dietType;
        if (properties.dietDetails !== undefined) this.dietDetails = properties.dietDetails;
        if (properties.isNeutered !== undefined) this.isNeutered = properties.isNeutered;
        if (properties.neuteredDate !== undefined) this.neuteredDate = properties.neuteredDate;
        if (properties.previousIllnesses !== undefined) this.previousIllnesses = properties.previousIllnesses;
        if (properties.hasAllergies !== undefined) this.hasAllergies = properties.hasAllergies;
        if (properties.allergiesDescription !== undefined) this.allergiesDescription = properties.allergiesDescription;
        if (properties.lastVaccinationDate !== undefined) this.lastVaccinationDate = properties.lastVaccinationDate;
        if (properties.coreVaccines !== undefined) this.coreVaccines = properties.coreVaccines;
        if (properties.lastDewormingInternal !== undefined) this.lastDewormingInternal = properties.lastDewormingInternal;
        if (properties.lastDewormingExternal !== undefined) this.lastDewormingExternal = properties.lastDewormingExternal;
        if (properties.otherPreventiveNotes !== undefined) this.otherPreventiveNotes = properties.otherPreventiveNotes;
        this.updatedAt = new Date();
    }

    public toPrimitives() {
        const core = (this.coreVaccines && typeof this.coreVaccines === "object") ? this.coreVaccines : {};
        return {
            id: this.id,
            petId: this.petId,
            provenance: this.provenance,
            diet: this.dietType,
            dietType: this.dietType,
            dietDetails: this.dietDetails,
            isNeutered: this.isNeutered,
            neuteredDate: this.neuteredDate,
            previousIllnesses: this.previousIllnesses,
            hasAllergies: this.hasAllergies,
            allergiesDescription: this.allergiesDescription,
            lastVaccinationDate: this.lastVaccinationDate,
            coreVaccines: this.coreVaccines,
            canineVaccines: core.canineVaccines || (core.distemper !== undefined ? core : null),
            felineVaccines: core.felineVaccines || (core.rhinotracheitis !== undefined ? core : null),
            deworming: core.deworming || {
                internalParasites: false,
                externalParasites: false,
                lastInternalDewormingDate: this.lastDewormingInternal,
                lastExternalDewormingDate: this.lastDewormingExternal,
            },
            lastDewormingInternal: this.lastDewormingInternal,
            lastDewormingExternal: this.lastDewormingExternal,
            otherPreventiveNotes: this.otherPreventiveNotes,
            otherVaccinesNotes: this.otherPreventiveNotes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
