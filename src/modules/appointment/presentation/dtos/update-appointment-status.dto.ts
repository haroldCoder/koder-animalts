import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';

export class UpdateAppointmentStatusDto {
    @ApiProperty({ description: 'Nuevo estado de la cita', enum: AppointmentStatus, example: AppointmentStatus.COMPLETED })
    @IsEnum(AppointmentStatus)
    @IsNotEmpty()
    status: AppointmentStatus;
}
