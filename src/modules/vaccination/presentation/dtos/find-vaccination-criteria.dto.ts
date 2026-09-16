import { ApiProperty } from '@nestjs/swagger';
import { VaccinationStatus } from "@vaccination/domain/enums";
import { FindVaccinationsCriteria } from "@vaccination/domain/ports";
import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min, IsIn, IsDate, IsUUID } from 'class-validator';

export class FindVaccinationsCriteriaDto implements FindVaccinationsCriteria {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @IsOptional()
    @Type(() => Date)
    @ApiProperty({ description: 'Propiedad startDate', example: 'Ejemplo' })
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @Type(() => Date)
    @ApiProperty({ description: 'Propiedad endDate', example: 'Ejemplo' })
    @IsDate()
    endDate?: Date;

    @ApiProperty({ description: 'Propiedad sortField', example: 'Ejemplo' })
    @IsOptional()
    @IsString()
    sortField?: string;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';

    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
    status?: VaccinationStatus[];

    @ApiProperty({ description: 'Propiedad petId', example: 'Ejemplo' })
    @IsOptional()
    @IsUUID()
    petId?: string;

    @ApiProperty({ description: 'Propiedad medicalRecordId', example: 'Ejemplo' })
    @IsOptional()
    @IsUUID()
    medicalRecordId?: string;
}