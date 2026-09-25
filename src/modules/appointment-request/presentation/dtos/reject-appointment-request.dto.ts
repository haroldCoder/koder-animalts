import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class RejectAppointmentRequestDto {
    @ApiProperty({ description: "Reason for rejecting the appointment request", maxLength: 300, example: "No hay disponibilidad de médicos en la fecha u horario solicitado" })
    @IsString()
    @MaxLength(300)
    reason: string;
}