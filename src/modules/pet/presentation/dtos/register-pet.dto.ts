import { GenderPet } from "@pet/domain/enums";
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class RegisterPetDto {
    @IsString()
    name: string;
    @IsString()
    species: string;
    @IsString()
    @IsOptional()
    breed?: string;
    @IsDate()
    @IsOptional()
    birthDate?: Date;
    @IsEnum(GenderPet)
    gender: GenderPet;
    @IsNumber()
    @IsOptional()
    weight?: number;
    @IsString()
    @IsOptional()
    color?: string;
    @IsString()
    @IsOptional()
    microchip?: string;
    @IsBoolean()
    isActive: boolean;
    @IsDate()
    @IsOptional()
    createdAt?: Date;
    @IsDate()
    @IsOptional()
    updatedAt?: Date;
    @IsString()
    userId: string;
    @IsString()
    clinicId: string;
}