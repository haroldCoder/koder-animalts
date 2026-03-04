import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RegisterDocumentDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    fileUrl: string;

    @IsString()
    fileKey?: string;

    @IsNumber()
    fileSize?: number;

    @IsString()
    fileType?: string;

    @IsString()
    category?: string;

    @IsString()
    petId?: string;

    @IsString()
    medicalRecordId?: string;

    @IsString()
    clinicId?: string;
}