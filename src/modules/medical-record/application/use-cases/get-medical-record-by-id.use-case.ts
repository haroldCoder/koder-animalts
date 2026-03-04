import { Inject, Injectable } from "@nestjs/common";
import { ResponseDto } from "@/common/domain/dto/response.dto";
import { ServerErrorException } from "@/common/domain/exceptions";

import type { MedicalRecordModel } from "@medical-record/domain/models";
import type { MedicalRecordRepository } from "@medical-record/domain/ports";
import { MedicalRecordIdNotFoundException } from "@/common/domain/exceptions";
import { MedicalRecordNotExistException } from "@medical-record/domain/exceptions";

@Injectable()
export class GetMedicalRecordByIdUseCase {
    constructor(
        @Inject("MedicalRecordRepository")
        private readonly medicalRecordRepository: MedicalRecordRepository,
    ) { }

    async execute(medicalRecordId: string): Promise<ResponseDto<MedicalRecordModel>> {
        try {
            if (!medicalRecordId) throw new MedicalRecordIdNotFoundException();

            const medicalRecord = await this.medicalRecordRepository.findById(medicalRecordId);
            if (!medicalRecord) throw new MedicalRecordNotExistException();

            return {
                statusCode: 200,
                data: medicalRecord,
            };
        } catch (error) {
            if (error.status && error.status !== 500) throw error;
            throw new ServerErrorException("Failed to retrieve medical record");
        }
    }
}
