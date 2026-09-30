import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class RegisterAppointmentDto {
    @ApiProperty({ description: 'Fecha y hora de la cita en formato ISO', example: '2026-10-15T10:00:00.000Z' })
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @ApiProperty({ description: 'Motivo de la cita', example: 'Control anual y vacunación' })
    @IsString()
    @IsNotEmpty()
    reason: string;

    @ApiProperty({ description: 'Notas u observaciones adicionales de la cita', example: 'Presenta leve decaimiento', required: false })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ description: 'ID de la mascota', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty()
    petId: string;

    @ApiProperty({ description: 'ID del usuario propietario o veterinario', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty()
    userId: string;
}
