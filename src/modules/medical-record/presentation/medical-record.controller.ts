import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { RegisterMedicalRecordDto } from "@medical-record/presentation/dtos";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { RegisterDocumentDto } from "@/common/domain/dto";
import { FolderUploadTypes, UploadPlatformEnum } from "@/common/upload/domain/enums";
import { UploadFileCommand } from "@/common/upload/application/use-cases";
import { CreateMedicalRecordUseCase, UploadDocumentToMedicalRecordUseCase, GetMedicalRecordByIdUseCase, GetMedicalRecordByVeterinarianIdUseCase, GetMedicalRecordByPetIdUseCase, GetMedicalRecordByUserIdUseCase } from "@medical-record/application/use-cases";

@ApiTags('Medical-record')
@Controller('medical-record')
export class MedicalRecordController {
    constructor(private readonly createMedicalRecordUseCase: CreateMedicalRecordUseCase,
        private readonly getMedicalRecordByIdUseCase: GetMedicalRecordByIdUseCase,
        private readonly uploadDocumentOfMedicalRecordUseCase: UploadDocumentToMedicalRecordUseCase,
        private readonly getMedicalRecordByVeterinarianIdUseCase: GetMedicalRecordByVeterinarianIdUseCase,
        private readonly getMedicalRecordByPetIdUseCase: GetMedicalRecordByPetIdUseCase,
        private readonly getMedicalRecordByUserIdUseCase: GetMedicalRecordByUserIdUseCase) { }

    @ApiOperation({ summary: 'Create medical record' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Post("register")
    async createMedicalRecord(@Body() medicalRecord: RegisterMedicalRecordDto) {
        return this.createMedicalRecordUseCase.execute(medicalRecord);
    }

    @ApiOperation({ summary: 'Get medical record by id' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
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

    @ApiOperation({ summary: 'Get medical record by veterinarian id' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get("veterinarian/:id")
    async getMedicalRecordByVeterinarianId(@Param("id") id: string) {
        return this.getMedicalRecordByVeterinarianIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Get medical record by pet id' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get("pet/:id")
    async getMedicalRecordByPetId(@Param("id") id: string) {
        return this.getMedicalRecordByPetIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Get medical record by user id' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get("pet/userId/:id")
    async getMedicalRecordByUserId(
        @Param("id") id: string,
        @Query("medicalRecordId") medicalRecordId?: string,
        @Query("petId") petId?: string,
        @Query("startDate") startDate?: string,
        @Query("endDate") endDate?: string
    ) {
        return this.getMedicalRecordByUserIdUseCase.execute(
            id,
            medicalRecordId,
            petId,
            startDate ? new Date(startDate) : undefined,
            endDate ? new Date(endDate) : undefined
        );
    }
}
