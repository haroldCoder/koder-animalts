import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class RegisterDocumentRequestDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsUUID()
    @IsOptional()
    petId?: string;

    @IsUUID()
    @IsOptional()
    medicalRecordId?: string;

    @IsString()
    @IsOptional()
    clinicId?: string;
}