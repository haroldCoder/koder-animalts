import { PartialType } from "@nestjs/mapped-types";
import { GenderPet } from "@pet/domain/enums";

export class PetModel {
    id: string;
    name: string;
    species: string;
    breed: string | null;
    gender: GenderPet;
    birthDate: Date | null;
    weight: number | null;
    mainImage: string;
    iaImage?: string | null;
    images?: string[] | null;
    ownerId: string;
    clinicId: string;
    clinicName?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class CreatePetModel {
    name: string;
    species: string;
    breed?: string | null;
    gender: GenderPet;
    birthDate?: Date | null;
    weight?: number | null;
    mainImage: string;
    iaImage?: string;
    images?: string[];
    clinicId: string;
}

export class UpdatePetModel extends PartialType(CreatePetModel) { }