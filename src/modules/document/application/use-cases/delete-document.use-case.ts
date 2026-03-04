import { ResponseDto } from "@/common/domain/dto";
import { DocumentIdNotFoundException } from "@document/domain/exceptions";
import type { IDocumentRepository } from "@document/domain/ports/document.repository";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class DeleteDocumentUseCase {
    constructor(
        @Inject("IDocumentRepository")
        private readonly documentRepository: IDocumentRepository,
    ) { }

    async execute(id: string): Promise<ResponseDto<string>> {
        try {
            const deletedId = await this.documentRepository.deleteDocument(id);

            return {
                statusCode: HttpStatus.OK,
                message: "Document deleted successfully",
                data: deletedId
            }
        } catch (error) {
            if (error instanceof DocumentIdNotFoundException) {
                throw error;
            }
            throw error;
        }
    }
}
