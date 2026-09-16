import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

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
}