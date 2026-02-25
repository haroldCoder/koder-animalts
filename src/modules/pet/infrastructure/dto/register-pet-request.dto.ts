import { GenderPet } from "@pet/domain/enums";
import { IsBoolean, IsDate, IsEnum, IsNumber, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class RegisterPetRequestDto {
    @IsString()
    name: string;
    @IsString()
    species: string;
    @IsString()
    breed?: string;
    @Transform(({ value }) => new Date(value))
    @IsDate()
    birthDate?: Date;
    @IsEnum(GenderPet)
    gender?: GenderPet;
    @IsNumber()
    @Transform(({ value }) => Number(value))
    weight?: number;
    @IsString()
    color?: string;
    @IsString()
    microchip?: string;
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    isActive: boolean;
    @Transform(({ value }) => new Date(value))
    @IsDate()
    createdAt: Date;
    @Transform(({ value }) => new Date(value))
    updatedAt: Date;
    @IsString()
    ownerId: string;
    @IsString()
    clinicId: string;
}