import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { DocumentFileUrlNotFoundException, DocumentIdNotFoundException, DocumentTitleNotFoundException } from "@document/domain/exceptions";
import { DocumentModel, RegisterDocumentModel, UpdateDocumentModel } from "@document/domain/models";
import { IDocumentRepository } from "@document/domain/ports/document.repository";

@Injectable()
export class PrismaDocumentService implements IDocumentRepository {
    constructor(private readonly prisma: PrismaService) { }

    async registerDocument(document: RegisterDocumentModel): Promise<string> {
        const { title, fileUrl } = document;

        if (!title) {
            throw new DocumentTitleNotFoundException();
        }

        if (!fileUrl) {
            throw new DocumentFileUrlNotFoundException();
        }

        const { id } = await this.prisma.document.create({
            data: document
        });

        return id;
    }

    async updateDocument(document: UpdateDocumentModel, id: string): Promise<string> {
        if (!id) {
            throw new DocumentIdNotFoundException();
        }

        const { id: updatedId } = await this.prisma.document.update({
            where: { id },
            data: document
        });

        return updatedId;
    }

    async deleteDocument(id: string): Promise<string> {
        if (!id) {
            throw new DocumentIdNotFoundException();
        }

        const { id: deletedId } = await this.prisma.document.delete({
            where: { id }
        });

        return deletedId;
    }

    async getDocumentById(id: string): Promise<DocumentModel> {
        if (!id) {
            throw new DocumentIdNotFoundException();
        }

        const document = await this.prisma.document.findUnique({
            where: { id }
        });

        if (!document) {
            throw new DocumentIdNotFoundException();
        }

        return document;
    }
}
