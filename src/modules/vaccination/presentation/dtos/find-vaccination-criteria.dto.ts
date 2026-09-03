import { VaccinationStatus } from "@vaccination/domain/enums";
import { FindVaccinationsCriteria } from "@vaccination/domain/ports";
import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min, IsIn, IsDate } from 'class-validator';

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
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;

    @IsOptional()
    @IsString()
    sortField?: string;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';

    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
    status?: VaccinationStatus[];

    @IsOptional()
    @IsString()
    petId?: string;
}