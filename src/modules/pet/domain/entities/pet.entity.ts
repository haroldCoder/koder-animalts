import { GenderPet } from "../enums";
import {
    PetClinicIdNotFoundException,
    PetMainImageNotFoundException,
    PetNameNotFoundException,
    PetOwnerIdNotFoundException,
    PetSpeciesNotFoundException,
} from "../exceptions";
import { PetIdNotFoundException } from "@/common/domain/exceptions";

export class PetEntity {
    private readonly id: string;
    private name: string;
    private species: string;
    private breed: string | null;
    private gender: GenderPet | null;
    private birthDate: Date | null;
    private weight: number | null;
    private color: string | null;
    private microchip: string | null;
    private isActive: boolean;
    private mainImage: string;
    private iaImage: string | null;
    private images: string[];
    private ownerId: string;
    private clinicId: string;
    private clinicName?: string;
    private readonly createdAt: Date;
    private readonly updatedAt: Date;

    private constructor(properties: {
        id: string;
        name: string;
        species: string;
        breed: string | null;
        gender: GenderPet | null;
        birthDate: Date | null;
        weight: number | null;
        color: string | null;
        microchip: string | null;
        isActive: boolean;
        mainImage: string;
        iaImage: string | null;
        images: string[];
        ownerId: string;
        clinicId: string;
        clinicName?: string;
        createdAt: Date;
        updatedAt: Date;
    }) {
        if (!properties.id) {
            throw new PetIdNotFoundException();
        }
        if (!properties.name) {
            throw new PetNameNotFoundException();
        }
        if (!properties.species) {
            throw new PetSpeciesNotFoundException();
        }
        if (!properties.mainImage) {
            throw new PetMainImageNotFoundException();
        }
        if (!properties.ownerId) {
            throw new PetOwnerIdNotFoundException();
        }
        if (!properties.clinicId) {
            throw new PetClinicIdNotFoundException();
        }

        this.id = properties.id;
        this.name = properties.name;
        this.species = properties.species;
        this.breed = properties.breed ?? null;
        this.gender = properties.gender ?? null;
        this.birthDate = properties.birthDate ?? null;
        this.weight = properties.weight ?? null;
        this.color = properties.color ?? null;
        this.microchip = properties.microchip ?? null;
        this.isActive = properties.isActive ?? true;
        this.mainImage = properties.mainImage;
        this.iaImage = properties.iaImage ?? null;
        this.images = properties.images ?? [];
        this.ownerId = properties.ownerId;
        this.clinicId = properties.clinicId;
        this.clinicName = properties.clinicName;
        this.createdAt = properties.createdAt;
        this.updatedAt = properties.updatedAt;
    }

    public static create(properties: {
        id: string;
        name: string;
        species: string;
        breed?: string | null;
        gender?: GenderPet | null;
        birthDate?: Date | null;
        weight?: number | null;
        color?: string | null;
        microchip?: string | null;
        isActive?: boolean;
        mainImage: string;
        iaImage?: string | null;
        images?: string[];
        ownerId: string;
        clinicId: string;
        clinicName?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }): PetEntity {
        return new PetEntity({
            id: properties.id,
            name: properties.name,
            species: properties.species,
            breed: properties.breed ?? null,
            gender: properties.gender ?? null,
            birthDate: properties.birthDate ?? null,
            weight: properties.weight ?? null,
            color: properties.color ?? null,
            microchip: properties.microchip ?? null,
            isActive: properties.isActive ?? true,
            mainImage: properties.mainImage,
            iaImage: properties.iaImage ?? null,
            images: properties.images ?? [],
            ownerId: properties.ownerId,
            clinicId: properties.clinicId,
            clinicName: properties.clinicName,
            createdAt: properties.createdAt ?? new Date(),
            updatedAt: properties.updatedAt ?? new Date(),
        });
    }

    // Getters
    public getId(): string { return this.id; }
    public getName(): string { return this.name; }
    public getSpecies(): string { return this.species; }
    public getBreed(): string | null { return this.breed; }
    public getGender(): GenderPet | null { return this.gender; }
    public getBirthDate(): Date | null { return this.birthDate; }
    public getWeight(): number | null { return this.weight; }
    public getColor(): string | null { return this.color; }
    public getMicrochip(): string | null { return this.microchip; }
    public getIsActive(): boolean { return this.isActive; }
    public getMainImage(): string { return this.mainImage; }
    public getIaImage(): string | null { return this.iaImage; }
    public getImages(): string[] { return this.images; }
    public getOwnerId(): string { return this.ownerId; }
    public getClinicId(): string { return this.clinicId; }
    public getClinicName(): string | undefined { return this.clinicName; }
    public getCreatedAt(): Date { return this.createdAt; }
    public getUpdatedAt(): Date { return this.updatedAt; }

    // State change actions
    public updateDetails(properties: {
        name?: string;
        species?: string;
        breed?: string | null;
        gender?: GenderPet | null;
        birthDate?: Date | null;
        weight?: number | null;
        color?: string | null;
        microchip?: string | null;
        isActive?: boolean;
        mainImage?: string;
        iaImage?: string | null;
        images?: string[];
        clinicId?: string;
    }): void {
        if (properties.name !== undefined) {
            if (!properties.name) throw new PetNameNotFoundException();
            this.name = properties.name;
        }
        if (properties.species !== undefined) {
            if (!properties.species) throw new PetSpeciesNotFoundException();
            this.species = properties.species;
        }
        if (properties.breed !== undefined) this.breed = properties.breed;
        if (properties.gender !== undefined) this.gender = properties.gender;
        if (properties.birthDate !== undefined) this.birthDate = properties.birthDate;
        if (properties.weight !== undefined) this.weight = properties.weight;
        if (properties.color !== undefined) this.color = properties.color;
        if (properties.microchip !== undefined) this.microchip = properties.microchip;
        if (properties.isActive !== undefined) this.isActive = properties.isActive;
        if (properties.mainImage !== undefined) {
            if (!properties.mainImage) throw new PetMainImageNotFoundException();
            this.mainImage = properties.mainImage;
        }
        if (properties.iaImage !== undefined) this.iaImage = properties.iaImage;
        if (properties.images !== undefined) this.images = properties.images;
        if (properties.clinicId !== undefined) {
            if (!properties.clinicId) throw new PetClinicIdNotFoundException();
            this.clinicId = properties.clinicId;
        }
    }
}
