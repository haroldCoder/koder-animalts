import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
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

    @ApiOperation({ summary: 'Update document' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Put(":id")
    async updateDocument(@Param("id") id: string, @Body() document: UpdateDocumentDto) {
        return this.updateDocumentUseCase.execute(document, id);
    }

    @ApiOperation({ summary: 'Delete document' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Delete(":id")
    async deleteDocument(@Param("id") id: string) {
        return this.deleteDocumentUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Get document by id' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get(":id")
    async getDocumentById(@Param("id") id: string) {
        return this.getDocumentByIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Find documents by user id' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
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

