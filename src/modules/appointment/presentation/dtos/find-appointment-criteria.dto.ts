import { ApiPropertyOptional } from '@nestjs/swagger';
import { FindAppointmentsCriteria } from "@appointment/domain/ports/appointment.repository";
import { IsOptional, IsInt, Min, IsString, IsIn } from "class-validator";
import { AppointmentStatus } from "@appointment/domain/enums/appointment-status.enum";
import { Transform, Type } from "class-transformer";

export class FindAppointmentsCriteriaDto implements FindAppointmentsCriteria {
    @ApiPropertyOptional({ description: 'Fecha de inicio para filtro', example: '2026-01-01T00:00:00.000Z' })
    @IsOptional()
    @Type(() => Date)
    startDate?: Date;

    @ApiPropertyOptional({ description: 'Fecha de fin para filtro', example: '2026-12-31T23:59:59.999Z' })
    @IsOptional()
    @Type(() => Date)
    endDate?: Date;

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

    @ApiPropertyOptional({ description: 'Campo por el cual ordenar', example: 'appointmentDate' })
    @IsOptional()
    @IsString()
    sortField?: string;

    @ApiPropertyOptional({ description: 'Orden ascendente o descendente', enum: ['asc', 'desc'], example: 'desc' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';

    @ApiPropertyOptional({ description: 'Estados de cita a filtrar', enum: AppointmentStatus, isArray: true })
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
    status?: AppointmentStatus[];
}