import { FindAppointmentsCriteria } from "@appointment/domain/ports/appointment.repository";
import { IsOptional } from "class-validator";
import { AppointmentStatus } from "@appointment/domain/enums/appointment-status.enum";
import { Transform } from "class-transformer";

export class FindAppointmentsCriteriaDto implements FindAppointmentsCriteria {
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
    status?: AppointmentStatus[];
}