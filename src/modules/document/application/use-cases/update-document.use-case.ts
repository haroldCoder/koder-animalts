import { ResponseDto } from "@/common/domain/dto";
import { DocumentIdNotFoundException } from "@document/domain/exceptions";
import { UpdateDocumentModel } from "@document/domain/models";
import type { IDocumentRepository } from "@document/domain/ports/document.repository";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UpdateDocumentUseCase {
    constructor(
        @Inject("IDocumentRepository")
        private readonly documentRepository: IDocumentRepository,
    ) { }

    async execute(document: UpdateDocumentModel, id: string): Promise<ResponseDto<string>> {
        try {
            const updatedId = await this.documentRepository.updateDocument(document, id);

            return {
                statusCode: HttpStatus.OK,
                message: "Document updated successfully",
                data: updatedId
            }
        } catch (error) {
            if (error instanceof DocumentIdNotFoundException) {
                throw error;
            }
            throw error;
        }
    }
}
