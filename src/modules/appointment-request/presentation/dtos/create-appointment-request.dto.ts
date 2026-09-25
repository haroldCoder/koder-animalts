import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateAppointmentRequestDto {
    @ApiProperty({ description: "ID of the pet", example: "123e4567-e89b-12d3-a456-426614174000" })
    @IsUUID()
    petId: string;

    @ApiProperty({ description: "ID of the veterinary clinic", example: "123e4567-e89b-12d3-a456-426614174001" })
    @IsUUID()
    clinicId: string;

    @ApiProperty({ description: "ID of the owner", example: "123e4567-e89b-12d3-a456-426614174002" })
    @IsUUID()
    ownerId: string;

    @ApiProperty({ description: "Requested appointment date and time", example: "2026-10-15T10:00:00.000Z" })
    @IsDateString()
    requestedDate: Date;

    @ApiProperty({ description: "Reason for the appointment request", maxLength: 500, example: "Vacunación anual y chequeo general" })
    @IsString()
    @MaxLength(500)
    reason: string;
}