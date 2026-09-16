import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class RegisterMedicalRecordDto {
    @ApiProperty({ description: 'Propiedad petId', example: 'Ejemplo' })
    @IsNotEmpty()
    @IsUUID()
    petId: string;

    @ApiProperty({ description: 'Propiedad userId', example: 'Ejemplo' })
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @ApiProperty({ description: 'Propiedad type', example: 'Ejemplo' })
    @IsNotEmpty()
    @IsString()
    type: string;

    @ApiProperty({ description: 'Propiedad reasonForVisit', example: 'Ejemplo' })
    @IsNotEmpty()
    @IsString()
    reasonForVisit: string;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    visitDate: Date;

    @ApiProperty({ description: 'Propiedad notes', example: 'Ejemplo' })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({ description: 'Propiedad diagnosis', example: 'Ejemplo' })
    @IsOptional()
    @IsString()
    diagnosis?: string;

    @ApiProperty({ description: 'Propiedad treatment', example: 'Ejemplo' })
    @IsOptional()
    @IsString()
    treatment?: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    createdAt?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    updatedAt?: Date;
}