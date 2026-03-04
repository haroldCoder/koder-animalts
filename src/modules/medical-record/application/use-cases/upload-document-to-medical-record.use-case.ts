import { Inject, Injectable } from "@nestjs/common";
import { ResponseDto } from "@/common/domain/dto/response.dto";
import { ServerErrorException } from "@/common/domain/exceptions";
import { MedicalRecordVisitDateNotFoundException } from "@medical-record/domain/exceptions";
import { RegisterDocumentModel } from "@/common/domain/models";
import { DocumentIdNotFoundException } from "@document/domain/exceptions";
import type { MedicalRecordRepository } from "@medical-record/domain/ports";
import { MedicalRecordIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class UploadDocumentToMedicalRecordUseCase {
    constructor(
        @Inject("MedicalRecordRepository")
        private readonly medicalRecordRepository: MedicalRecordRepository,
    ) { }

    async execute(medicalRecordId: string, documents: RegisterDocumentModel[]): Promise<ResponseDto<string>> {
        try {
            await this.medicalRecordRepository.uploadDocumentToMedicalRecord(medicalRecordId, documents);

            return {
                statusCode: 201,
                message: `${documents.length} document${documents.length === 1 ? '' : 's'} uploaded successfully`,
            };
        } catch (error) {
            if (
                error instanceof MedicalRecordIdNotFoundException ||
                error instanceof MedicalRecordVisitDateNotFoundException ||
                error instanceof DocumentIdNotFoundException
            ) throw error;
            throw new ServerErrorException("Failed to upload document");
        }
    }
}
