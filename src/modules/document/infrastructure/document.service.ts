import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { RegisterDocumentDto, UpdateDocumentDto } from "@document/infrastructure/dto";
import { DocumentFileUrlNotFoundException, DocumentIdNotFoundException, DocumentTitleNotFoundException } from "@document/domain/exceptions";
import { ResponseDto } from "@/common/dto/response.dto";
import { DocumentEntity } from "@document/domain/entities";

@Injectable()
export class DocumentService {
    constructor(private readonly prisma: PrismaService) { }

    async registerDocument(document: RegisterDocumentDto): Promise<ResponseDto<string>> {
        const { title, fileUrl } = document;

        if (!title) {
            throw new DocumentTitleNotFoundException();
        }

        if (!fileUrl) {
            throw new DocumentFileUrlNotFoundException();
        }

        await this.prisma.document.create({
            data: document
        });

        return {
            statusCode: HttpStatus.CREATED,
            message: "Document registered successfully",
        }
    }

    async updateDocument(document: UpdateDocumentDto, id: string): Promise<ResponseDto<string>> {
        if (!id) {
            throw new DocumentIdNotFoundException();
        }

        await this.prisma.document.update({
            where: { id },
            data: document
        });

        return {
            statusCode: HttpStatus.OK,
            message: "Document updated successfully",
        }
    }

    async deleteDocument(id: string): Promise<ResponseDto<string>> {
        if (!id) {
            throw new DocumentIdNotFoundException();
        }

        await this.prisma.document.delete({
            where: { id }
        });

        return {
            statusCode: HttpStatus.OK,
            message: "Document deleted successfully",
        }
    }

    async getDocumentById(id: string): Promise<ResponseDto<DocumentEntity>> {
        if (!id) {
            throw new DocumentIdNotFoundException();
        }

        const document = await this.prisma.document.findUnique({
            where: { id }
        });

        if (!document) {
            throw new DocumentIdNotFoundException();
        }

        return {
            statusCode: HttpStatus.OK,
            data: document as DocumentEntity
        }
    }
}
