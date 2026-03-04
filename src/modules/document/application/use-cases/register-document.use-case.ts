import { ResponseDto } from "@/common/domain/dto";
import { DocumentFileUrlNotFoundException, DocumentTitleNotFoundException } from "@document/domain/exceptions";
import { RegisterDocumentModel } from "@document/domain/models";
import type { IDocumentRepository } from "@document/domain/ports/document.repository";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class RegisterDocumentUseCase {
    constructor(
        @Inject("IDocumentRepository")
        private readonly documentRepository: IDocumentRepository,
    ) { }

    async execute(document: RegisterDocumentModel): Promise<ResponseDto<string>> {
        try {
            const id = await this.documentRepository.registerDocument(document);

            return {
                statusCode: HttpStatus.CREATED,
                message: "Document registered successfully",
                data: id
            }
        } catch (error) {
            if (error instanceof DocumentTitleNotFoundException || error instanceof DocumentFileUrlNotFoundException) {
                throw error;
            }
            throw error;
        }
    }
}