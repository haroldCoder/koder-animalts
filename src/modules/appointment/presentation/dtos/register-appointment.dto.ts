import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class RegisterAppointmentDto {
    @ApiProperty({ description: 'Propiedad date', example: 'Ejemplo' })
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @ApiProperty({ description: 'Propiedad reason', example: 'Ejemplo' })
    @IsString()
    @IsNotEmpty()
    reason: string;

    @ApiProperty({ description: 'Propiedad notes', example: 'Ejemplo' })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ description: 'Propiedad petId', example: 'Ejemplo' })
    @IsUUID()
    @IsNotEmpty()
    petId: string;

    @ApiProperty({ description: 'Propiedad userId', example: 'Ejemplo' })
    @IsUUID()
    @IsNotEmpty()
    userId: string;
}
