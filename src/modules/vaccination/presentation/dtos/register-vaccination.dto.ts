import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class RegisterVaccinationDto {
    @ApiProperty({ description: 'Propiedad vaccineName', example: 'Ejemplo' })
    @IsNotEmpty()
    @IsString()
    vaccineName: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => value ? new Date(value) : null)
    dateAdministered?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => value ? new Date(value) : null)
    nextDueDate?: Date;

    @ApiProperty({ description: 'Propiedad lotNumber', example: 'Ejemplo' })
    @IsOptional()
    @IsString()
    lotNumber?: string;

    @ApiProperty({ description: 'Propiedad medicalRecordId', example: 'Ejemplo' })
    @IsNotEmpty()
    @IsUUID()
    medicalRecordId: string;

    @ApiProperty({ description: 'Propiedad userId', example: 'Ejemplo' })
    @IsNotEmpty()
    @IsUUID()
    userId: string;
}
