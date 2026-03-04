import { ResponseDto } from "@/common/domain/dto";
import { DocumentIdNotFoundException } from "@document/domain/exceptions";
import { DocumentModel } from "@document/domain/models";
import type { IDocumentRepository } from "@document/domain/ports/document.repository";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetDocumentByIdUseCase {
    constructor(
        @Inject("IDocumentRepository")
        private readonly documentRepository: IDocumentRepository,
    ) { }

    async execute(id: string): Promise<ResponseDto<DocumentModel>> {
        try {
            const document = await this.documentRepository.getDocumentById(id);

            return {
                statusCode: HttpStatus.OK,
                message: "Document retrieved successfully",
                data: document
            }
        } catch (error) {
            if (error instanceof DocumentIdNotFoundException) {
                throw error;
            }
            throw error;
        }
    }
}
