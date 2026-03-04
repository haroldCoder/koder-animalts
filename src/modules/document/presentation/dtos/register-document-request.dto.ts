import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterDocumentRequestDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    petId?: string;

    @IsString()
    @IsOptional()
    medicalRecordId?: string;

    @IsString()
    @IsOptional()
    clinicId?: string;
}