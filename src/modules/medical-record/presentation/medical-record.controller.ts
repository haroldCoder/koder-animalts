import { Body, Controller, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { RegisterMedicalRecordDto } from "@medical-record/presentation/dtos";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { RegisterDocumentDto } from "@/common/domain/dto";
import { FolderUploadTypes, UploadPlatformEnum } from "@/common/upload/domain/enums";
import { UploadFileCommand } from "@/common/upload/application/use-cases";
import { CreateMedicalRecordUseCase, UploadDocumentToMedicalRecordUseCase } from "@medical-record/application/use-cases";
import { GetMedicalRecordByIdUseCase } from "@medical-record/application/use-cases";

@Controller('medical-record')
export class MedicalRecordController {
    constructor(private readonly createMedicalRecordUseCase: CreateMedicalRecordUseCase,
        private readonly getMedicalRecordByIdUseCase: GetMedicalRecordByIdUseCase,
        private readonly uploadDocumentOfMedicalRecordUseCase: UploadDocumentToMedicalRecordUseCase) { }

    @Post("register")
    async createMedicalRecord(@Body() medicalRecord: RegisterMedicalRecordDto) {
        return this.createMedicalRecordUseCase.execute(medicalRecord);
    }

    @Get("/:id")
    async getMedicalRecordById(@Param("id") id: string) {
        return this.getMedicalRecordByIdUseCase.execute(id);
    }

    @Put("upload-documents/:id")
    @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }]))
    async uploadDocumentOfMedicalRecord(@Param("id") id: string, @UploadedFiles() files: { files?: Express.Multer.File[] }) {
        const documents: RegisterDocumentDto[] = [];

        if (files.files) {
            for (const file of files.files) {
                const { fileUrl, fileKey, fileSize } = await new UploadFileCommand(file, UploadPlatformEnum.CLOUDINARY, FolderUploadTypes.MEDICAL_RECORDS).execute();
                documents.push({
                    title: file.originalname,
                    fileUrl,
                    fileKey,
                    fileSize
                });
            }
        }

        return this.uploadDocumentOfMedicalRecordUseCase.execute(id, documents);
    }
}
