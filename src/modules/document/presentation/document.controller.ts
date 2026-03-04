import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { RegisterDocumentRequestDto, UpdateDocumentDto } from "@document/presentation/dtos";
import { UploadFileCommand } from "@/common/upload/application/use-cases";
import { FolderUploadTypes, UploadPlatformEnum } from "@/common/upload/domain/enums";
import { FileInterceptor } from "@nestjs/platform-express";
import {
    DeleteDocumentUseCase,
    GetDocumentByIdUseCase,
    RegisterDocumentUseCase,
    UpdateDocumentUseCase
} from "@document/application/use-cases";

@Controller("document")
export class DocumentController {
    constructor(
        private readonly registerDocumentUseCase: RegisterDocumentUseCase,
        private readonly updateDocumentUseCase: UpdateDocumentUseCase,
        private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
        private readonly getDocumentByIdUseCase: GetDocumentByIdUseCase,
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

    @Put(":id")
    async updateDocument(@Param("id") id: string, @Body() document: UpdateDocumentDto) {
        return this.updateDocumentUseCase.execute(document, id);
    }

    @Delete(":id")
    async deleteDocument(@Param("id") id: string) {
        return this.deleteDocumentUseCase.execute(id);
    }

    @Get(":id")
    async getDocumentById(@Param("id") id: string) {
        return this.getDocumentByIdUseCase.execute(id);
    }
}

