import { GenderPet } from "@pet/domain/enums";

export interface RegisterPetParams {
    name: string;
    species: string;
    breed?: string | null;
    gender: GenderPet;
    birthDate?: Date | null;
    weight?: number | null;
    color?: string | null;
    microchip?: string | null;
    mainImage: string;
    iaImage?: string | null;
    images?: string[];
    clinicId: string;
}

export interface UpdatePetParams {
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
}
