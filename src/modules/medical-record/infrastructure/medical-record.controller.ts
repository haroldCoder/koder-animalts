import { Body, Controller, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { MedicalRecordService } from "./medical-record.service";
import { RegisterMedicalRecordDto } from "@medical-record/infrastructure/dto";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { RegisterDocumentDto } from "@document/infrastructure/dto";
import { FolderUploadTypes, UploadPlatformEnum } from "@/common/upload/domain/enums";
import { UploadFileCommand } from "@/common/upload/application/use-cases";

@Controller('medical-record')
export class MedicalRecordController {
    constructor(private readonly medicalRecordService: MedicalRecordService) { }

    @Post("register")
    async createMedicalRecord(@Body() medicalRecord: RegisterMedicalRecordDto) {
        return this.medicalRecordService.createMedicalRecord(medicalRecord);
    }

    @Get("/:id")
    async getMedicalRecordById(@Param("id") id: string) {
        return this.medicalRecordService.getMedicalRecordById(id);
    }

    @Put("upload-documents/:id")
    @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }]))
    async uploadDocumentOfMedicalRecord(@Param("id") id: string, @UploadedFiles() files: { files?: Express.Multer.File[] }) {
        const documents: RegisterDocumentDto[] = [];

        for (const file of files.files!) {
            const { fileUrl, fileKey, fileSize } = await new UploadFileCommand(file, UploadPlatformEnum.CLOUDINARY, FolderUploadTypes.MEDICAL_RECORDS).execute();
            documents.push({
                title: file.originalname,
                fileUrl,
                fileKey,
                fileSize
            });
        }

        return this.medicalRecordService.uploadDocumentOfMedicalRecord(id, documents);
    }
}
