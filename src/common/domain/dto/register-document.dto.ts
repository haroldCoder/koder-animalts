import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class RegisterDocumentDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    fileUrl: string;

    @IsOptional()
    @IsString()
    fileKey?: string;

    @IsOptional()
    @IsNumber()
    fileSize?: number;

    @IsOptional()
    @IsString()
    fileType?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsUUID()
    petId?: string;

    @IsOptional()
    @IsUUID()
    medicalRecordId?: string;

    @IsOptional()
    @IsUUID()
    clinicId?: string;
}