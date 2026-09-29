import { ApiPropertyOptional } from '@nestjs/swagger';
import { VaccinationStatus } from "@vaccination/domain/enums";
import { FindVaccinationsCriteria } from "@vaccination/domain/ports";
import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min, IsIn, IsDate, IsUUID } from 'class-validator';

export class FindVaccinationsCriteriaDto implements FindVaccinationsCriteria {
    @ApiPropertyOptional({ description: 'Número de página', example: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ description: 'Cantidad de elementos por página', example: 10, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @ApiPropertyOptional({ description: 'Fecha de inicio para filtro', example: '2026-01-01T00:00:00.000Z' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startDate?: Date;

    @ApiPropertyOptional({ description: 'Fecha de fin para filtro', example: '2026-12-31T23:59:59.999Z' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;

    @ApiPropertyOptional({ description: 'Campo por el cual ordenar', example: 'createdAt' })
    @IsOptional()
    @IsString()
    sortField?: string;

    @ApiPropertyOptional({ description: 'Orden ascendente o descendente', enum: ['asc', 'desc'], example: 'desc' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';

    @ApiPropertyOptional({ description: 'Estados de vacunación a filtrar', enum: VaccinationStatus, isArray: true })
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
    status?: VaccinationStatus[];

    @ApiPropertyOptional({ description: 'ID de la mascota', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID()
    petId?: string;

    @ApiPropertyOptional({ description: 'ID del historial médico', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID()
    medicalRecordId?: string;
}