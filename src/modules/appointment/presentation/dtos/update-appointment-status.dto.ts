import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';

export class UpdateAppointmentStatusDto {
    @ApiProperty({ description: 'Propiedad status', example: 'Ejemplo' })
    @IsEnum(AppointmentStatus)
    @IsNotEmpty()
    status: AppointmentStatus;
}
