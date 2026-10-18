import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class RegisterDocumentRequestDto {
    @ApiProperty({ description: 'Propiedad title', example: 'Ejemplo' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ description: 'Propiedad category', example: 'Ejemplo' })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiProperty({ description: 'Propiedad petId', example: 'Ejemplo' })
    @IsUUID()
    @IsOptional()
    petId?: string;

    @ApiProperty({ description: 'Propiedad medicalRecordId', example: 'Ejemplo' })
    @IsUUID()
    @IsOptional()
    medicalRecordId?: string;

    @ApiProperty({ description: 'Propiedad clinicId', example: 'Ejemplo' })
    @IsString()
    @IsOptional()
    clinicId?: string;

    @ApiProperty({ description: 'ID del veterinario asociado', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
    @IsUUID()
    @IsOptional()
    veterinarianId?: string;

    @ApiProperty({ description: 'Propiedad ownerReadable', example: 'true' })
    @IsBoolean()
    @IsOptional()
    ownerReadable?: boolean = false;
}