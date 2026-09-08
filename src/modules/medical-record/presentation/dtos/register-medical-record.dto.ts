import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class RegisterMedicalRecordDto {
    @IsNotEmpty()
    @IsUUID()
    petId: string;

    @IsNotEmpty()
    @IsUUID()
    userId: string;

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

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    diagnosis?: string;

    @IsOptional()
    @IsString()
    treatment?: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    createdAt?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    updatedAt?: Date;
}