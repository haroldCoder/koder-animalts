import { FindAppointmentsCriteria } from "@appointment/domain/ports/appointment.repository";
import { IsOptional, IsInt, Min, IsString, IsIn } from "class-validator";
import { AppointmentStatus } from "@appointment/domain/enums/appointment-status.enum";
import { Transform, Type } from "class-transformer";

export class FindAppointmentsCriteriaDto implements FindAppointmentsCriteria {
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
    @IsString()
    sortField?: string;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';


    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
    status?: AppointmentStatus[];
}