import { GenderPet } from "@pet/domain/enums";
import { IsBoolean, IsDate, IsEnum, IsNumber, IsString } from "class-validator";

export class RegisterPetDto {
    @IsString()
    name: string;
    @IsString()
    species: string;
    @IsString()
    breed?: string;
    @IsDate()
    birthDate?: Date;
    @IsEnum(GenderPet)
    gender?: GenderPet;
    @IsNumber()
    weight?: number;
    @IsString()
    color?: string;
    @IsString()
    microchip?: string;
    @IsBoolean()
    isActive: boolean;
    @IsDate()
    createdAt: Date;
    @IsDate()
    updatedAt: Date;
    @IsString()
    mainImage: string;
    @IsString()
    iaImage?: string;
    @IsString()
    images?: string[];
    @IsString()
    ownerId: string;
    @IsString()
    clinicId: string;
}