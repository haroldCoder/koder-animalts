import { ResponseDto } from "@/common/domain/dto";
import { DocumentEntity } from "@document/domain/entities";
import { FindDocumentsCriteria } from "@document/domain/ports/document.repository";
import type { IDocumentRepository } from "@document/domain/ports/document.repository";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class FindDocumentsByUserIdUseCase {
    constructor(
        @Inject("IDocumentRepository")
        private readonly documentRepository: IDocumentRepository,
    ) { }

    async execute(
        userId: string,
        queries: FindDocumentsCriteria
    ): Promise<ResponseDto<DocumentEntity[]>> {
        const { startDate, endDate, veterinarianName, documentName, medicalRecordId } = queries;

        const hasStartDate = !!startDate;
        const hasEndDate = !!endDate;
        const hasVetName = !!veterinarianName;
        const hasDocName = !!documentName;
        const hasMedicalRecordId = !!medicalRecordId;

        if (!userId || (!hasStartDate && !hasEndDate && !hasVetName && !hasDocName && !hasMedicalRecordId)) {
            return {
                statusCode: HttpStatus.OK,
                message: "Documents retrieved successfully",
                data: []
            };
        }

        let start: Date | undefined;
        let end: Date | undefined;

        if (hasStartDate) {
            start = new Date(startDate!);
            if (isNaN(start.getTime())) {
                if (!hasEndDate && !hasVetName && !hasDocName) {
                    return {
                        statusCode: HttpStatus.OK,
                        message: "Documents retrieved successfully",
                        data: []
                    };
                }
                start = undefined;
            }
        }

        if (hasEndDate) {
            end = new Date(endDate!);
            if (isNaN(end.getTime())) {
                if (!start && !hasVetName && !hasDocName) {
                    return {
                        statusCode: HttpStatus.OK,
                        message: "Documents retrieved successfully",
                        data: []
                    };
                }
                end = undefined;
            }
        }

        try {
            const documents = await this.documentRepository.findDocumentsByUserId(userId, {
                startDate: start,
                endDate: end,
                veterinarianName: hasVetName ? veterinarianName : undefined,
                documentName: hasDocName ? documentName : undefined,
                medicalRecordId: hasMedicalRecordId ? medicalRecordId?.trim() : undefined,
            });

            return {
                statusCode: HttpStatus.OK,
                message: "Documents retrieved successfully",
                data: documents
            };
        } catch (error) {
            throw error;
        }
    }
}
