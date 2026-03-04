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
    ownerId: string;
    clinicId: string;
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
    ownerId: string;
    clinicId: string;
}

export class UpdatePetModel extends PartialType(CreatePetModel) { }