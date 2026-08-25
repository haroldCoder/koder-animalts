import { IsString, IsNotEmpty, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class RegisterAppointmentDto {
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    reason: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsUUID()
    @IsNotEmpty()
    petId: string;

    @IsUUID()
    @IsNotEmpty()
    userId: string;
}
