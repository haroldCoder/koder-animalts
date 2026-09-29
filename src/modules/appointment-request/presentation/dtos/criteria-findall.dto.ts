import { IsOptional, IsEnum, Min, IsString } from 'class-validator';
import type { CriteriaAppointmentRequest } from '../../domain/ports';
import { RequestStatus } from '../../domain/enums';
import { Transform, Type } from 'class-transformer';

export class CriteriaFindAllDto implements CriteriaAppointmentRequest {
    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined) return value;
        const arr = Array.isArray(value) ? value : String(value).split(',');
        return arr.map((v: string) => v.trim());
    })
    @IsEnum(RequestStatus, { each: true, message: 'Every status must be a valid RequestStatus enum value' })
    status?: RequestStatus[];

    @IsOptional()
    @Type(() => Number)
    @Min(1, { message: 'Page must be at least 1' })
    page?: number;

    @IsOptional()
    @Min(1, { message: 'Limit must be at least 1' })
    limit?: number;

    @IsOptional()
    @IsString({ message: 'Sort field must be a string' })
    sortField?: string;

    @IsOptional()
    @IsEnum(['asc', 'desc'], { message: 'Sort order must be asc or desc' })
    sortOrder?: 'asc' | 'desc';
}