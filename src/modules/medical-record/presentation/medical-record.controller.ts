import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
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

    @ApiOperation({ summary: 'Crear un nuevo historial médico' })
    @ApiResponse({ status: 201, description: 'Historial médico creado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida o datos incorrectos.' })
    @Post("register")
    async createMedicalRecord(@Body() medicalRecord: RegisterMedicalRecordDto) {
        return this.createMedicalRecordUseCase.execute(medicalRecord);
    }

    @ApiOperation({ summary: 'Obtener historial médico por ID' })
    @ApiParam({ name: 'id', description: 'ID del historial médico', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Historial médico encontrado.' })
    @ApiResponse({ status: 404, description: 'Historial médico no encontrado.' })
    @Get("/:id")
    async getMedicalRecordById(@Param("id") id: string) {
        return this.getMedicalRecordByIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Subir documentos a un historial médico' })
    @ApiParam({ name: 'id', description: 'ID del historial médico', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Archivos adjuntos para el historial médico'
                }
            }
        }
    })
    @ApiResponse({ status: 200, description: 'Documentos subidos y vinculados exitosamente.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida o archivos no permitidos.' })
    @ApiResponse({ status: 404, description: 'Historial médico no encontrado.' })
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

    @ApiOperation({ summary: 'Obtener historiales médicos por ID de veterinario' })
    @ApiParam({ name: 'id', description: 'ID del veterinario', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Historiales médicos obtenidos exitosamente.' })
    @ApiResponse({ status: 404, description: 'Veterinario no encontrado.' })
    @Get("veterinarian/:id")
    async getMedicalRecordByVeterinarianId(@Param("id") id: string) {
        return this.getMedicalRecordByVeterinarianIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Obtener historial médico por ID de mascota' })
    @ApiParam({ name: 'id', description: 'ID de la mascota', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Historial médico de la mascota obtenido exitosamente.' })
    @ApiResponse({ status: 404, description: 'Mascota o historial no encontrado.' })
    @Get("pet/:id")
    async getMedicalRecordByPetId(@Param("id") id: string) {
        return this.getMedicalRecordByPetIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Obtener historiales médicos por ID de usuario propietario con filtros' })
    @ApiParam({ name: 'id', description: 'ID del usuario propietario', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiQuery({ name: 'medicalRecordId', required: false, description: 'Filtrar por ID específico de historial' })
    @ApiQuery({ name: 'petId', required: false, description: 'Filtrar por ID de mascota' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Fecha de inicio del rango' })
    @ApiQuery({ name: 'endDate', required: false, description: 'Fecha de fin del rango' })
    @ApiResponse({ status: 200, description: 'Historiales médicos encontrados.' })
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
