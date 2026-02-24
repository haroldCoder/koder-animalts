import { GenderPet } from "@pet/domain/enums";

export class RegisterPetDto {
    name: string;
    species: string;
    breed?: string;
    birthDate?: Date;
    gender?: GenderPet;
    weight?: number;
    color?: string;
    microchip?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    mainImage: string;
    iaImage?: string;
    images?: string[];
    ownerId: string;
    clinicId: string;
}