import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { RegisterDocumentRequestDto, UpdateDocumentDto } from "@document/presentation/dtos";
import { UploadFileCommand } from "@/common/upload/application/use-cases";
import { FolderUploadTypes, UploadPlatformEnum } from "@/common/upload/domain/enums";
import { FileInterceptor } from "@nestjs/platform-express";
import {
    DeleteDocumentUseCase,
    FindDocumentsByUserIdUseCase,
    GetDocumentByIdUseCase,
    RegisterDocumentUseCase,
    UpdateDocumentUseCase
} from "@document/application/use-cases";

@ApiTags('Document')
@Controller("document")
export class DocumentController {
    constructor(
        private readonly registerDocumentUseCase: RegisterDocumentUseCase,
        private readonly updateDocumentUseCase: UpdateDocumentUseCase,
        private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
        private readonly getDocumentByIdUseCase: GetDocumentByIdUseCase,
        private readonly findDocumentsByUserIdUseCase: FindDocumentsByUserIdUseCase,
    ) { }

    @ApiOperation({ summary: 'Subir y registrar un nuevo documento' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['title', 'file'],
            properties: {
                title: { type: 'string', example: 'Radiografía de tórax' },
                category: { type: 'string', example: 'Radiografía' },
                petId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                medicalRecordId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                clinicId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                file: { type: 'string', format: 'binary', description: 'Archivo del documento a subir' },
            }
        }
    })
    @ApiResponse({ status: 201, description: 'Documento registrado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o falta archivo.' })
    @Post("register")
    @UseInterceptors(FileInterceptor('file'))
    async registerDocument(@Body() document: RegisterDocumentRequestDto, @UploadedFile() file: Express.Multer.File) {
        const { fileUrl, fileKey, fileSize, fileType } = await new UploadFileCommand(file, UploadPlatformEnum.CLOUDINARY, FolderUploadTypes.DOCS).execute();

        return this.registerDocumentUseCase.execute({
            ...document,
            fileUrl,
            fileKey,
            fileSize,
            fileType,
        });
    }

    @ApiOperation({ summary: 'Actualizar información de un documento' })
    @ApiParam({ name: 'id', description: 'ID del documento', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Documento actualizado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @ApiResponse({ status: 404, description: 'Documento no encontrado.' })
    @Put(":id")
    async updateDocument(@Param("id") id: string, @Body() document: UpdateDocumentDto) {
        return this.updateDocumentUseCase.execute(document, id);
    }

    @ApiOperation({ summary: 'Eliminar un documento' })
    @ApiParam({ name: 'id', description: 'ID del documento', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Documento eliminado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Documento no encontrado.' })
    @Delete(":id")
    async deleteDocument(@Param("id") id: string) {
        return this.deleteDocumentUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Obtener un documento por ID' })
    @ApiParam({ name: 'id', description: 'ID del documento', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Documento obtenido exitosamente.' })
    @ApiResponse({ status: 404, description: 'Documento no encontrado.' })
    @Get(":id")
    async getDocumentById(@Param("id") id: string) {
        return this.getDocumentByIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Buscar documentos de un usuario con filtros' })
    @ApiParam({ name: 'userId', description: 'ID del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Fecha de inicio del rango' })
    @ApiQuery({ name: 'endDate', required: false, description: 'Fecha de fin del rango' })
    @ApiQuery({ name: 'veterinarianName', required: false, description: 'Nombre del veterinario' })
    @ApiQuery({ name: 'documentName', required: false, description: 'Nombre o título del documento' })
    @ApiQuery({ name: 'medicalRecordId', required: false, description: 'ID del historial médico asociado' })
    @ApiResponse({ status: 200, description: 'Documentos encontrados exitosamente.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get("user/:userId")
    async findDocumentsByUserId(
        @Param("userId") userId: string,
        @Query("startDate") startDate?: string,
        @Query("endDate") endDate?: string,
        @Query("veterinarianName") veterinarianName?: string,
        @Query("documentName") documentName?: string,
        @Query("medicalRecordId") medicalRecordId?: string,
    ) {
        return this.findDocumentsByUserIdUseCase.execute(userId, {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            veterinarianName: veterinarianName,
            documentName: documentName,
            medicalRecordId,
        });
    }
}

