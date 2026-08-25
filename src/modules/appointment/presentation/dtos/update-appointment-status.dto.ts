import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';

export class UpdateAppointmentStatusDto {
    @IsEnum(AppointmentStatus)
    @IsNotEmpty()
    status: AppointmentStatus;
}
