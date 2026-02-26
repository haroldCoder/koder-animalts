import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class RegisterMedicalRecordDto {
    @IsNotEmpty()
    @IsString()
    petId: string;

    @IsNotEmpty()
    @IsString()
    veterinarianId: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    reasonForVisit: string;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    visitDate: Date;

    @IsString()
    notes: string;

    @IsString()
    diagnosis: string;

    @IsString()
    treatment: string;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    createdAt: Date;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    updatedAt: Date;
}