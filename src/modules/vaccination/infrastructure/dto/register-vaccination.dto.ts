import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class RegisterVaccinationDto {
    @IsNotEmpty()
    @IsString()
    vaccineName: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => value ? new Date(value) : null)
    dateAdministered?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => value ? new Date(value) : null)
    nextDueDate?: Date;

    @IsOptional()
    @IsString()
    lotNumber?: string;

    @IsNotEmpty()
    medicalRecordId: string;
}
