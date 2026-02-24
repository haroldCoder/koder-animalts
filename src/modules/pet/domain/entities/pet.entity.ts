import { GenderPet } from "@pet/domain/enums";

export interface PetEntity {
    id: string;
    name: string;
    species: string;
    breed: string | null;
    birthDate: Date | null;
    gender: GenderPet | null;
    weight: number | null;
    color: string | null;
    microchip: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    mainImage: string;
    iaImage: string | null;
    images: string[] | null;
    ownerId: string;
    clinicId: string;
}