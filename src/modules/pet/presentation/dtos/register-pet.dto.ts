import { GenderPet } from "@pet/domain/enums";
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RegisterPetDto {
    @ApiProperty({ description: 'Nombre de la mascota', example: 'Firulais' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Especie de la mascota', example: 'Perro' })
    @IsString()
    species: string;

    @ApiProperty({ description: 'Raza de la mascota', example: 'Golden Retriever', required: false })
    @IsString()
    @IsOptional()
    breed?: string;

    @ApiProperty({ description: 'Fecha de nacimiento de la mascota', example: '2020-01-01T00:00:00.000Z', required: false })
    @IsDate()
    @IsOptional()
    birthDate?: Date;

    @ApiProperty({ description: 'Género de la mascota', enum: GenderPet, example: 'MALE' })
    @IsEnum(GenderPet)
    gender: GenderPet;

    @ApiProperty({ description: 'Peso de la mascota en kg', example: 15.5, required: false })
    @IsNumber()
    @IsOptional()
    weight?: number;

    @ApiProperty({ description: 'Color principal de la mascota', example: 'Dorado', required: false })
    @IsString()
    @IsOptional()
    color?: string;

    @ApiProperty({ description: 'Código del microchip (si lo tiene)', example: '981020000123456', required: false })
    @IsString()
    @IsOptional()
    microchip?: string;

    @ApiProperty({ description: 'Estado activo de la mascota', example: true })
    @IsBoolean()
    isActive: boolean;

    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @IsDate()
    @IsOptional()
    updatedAt?: Date;

    @ApiProperty({ description: 'ID del usuario propietario', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    userId: string;

    @ApiProperty({ description: 'ID de la clínica veterinaria asociada', example: '123e4567-e89b-12d3-a456-426614174001' })
    @IsUUID()
    clinicId: string;
}