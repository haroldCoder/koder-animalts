import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { DocumentService } from "@document/infrastructure/document.service";
import { RegisterDocumentRequestDto, UpdateDocumentDto } from "@document/infrastructure/dto";
import { UploadFileCommand } from "@/common/upload/application/use-cases";
import { FolderUploadTypes, UploadPlatformEnum } from "@/common/upload/domain/enums";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("document")
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @Post("register")
    @UseInterceptors(FileInterceptor('file'))
    async registerDocument(@Body() document: RegisterDocumentRequestDto, @UploadedFile() file: Express.Multer.File) {
        const { fileUrl, fileKey, fileSize, fileType } = await new UploadFileCommand(file, UploadPlatformEnum.CLOUDINARY, FolderUploadTypes.DOCS).execute();

        return this.documentService.registerDocument({
            ...document,
            fileUrl,
            fileKey,
            fileSize,
            fileType,
        });
    }

    @Put(":id")
    async updateDocument(@Param("id") id: string, @Body() document: UpdateDocumentDto) {
        return this.documentService.updateDocument(document, id);
    }

    @Delete(":id")
    async deleteDocument(@Param("id") id: string) {
        return this.documentService.deleteDocument(id);
    }

    @Get(":id")
    async getDocumentById(@Param("id") id: string) {
        return this.documentService.getDocumentById(id);
    }
}
