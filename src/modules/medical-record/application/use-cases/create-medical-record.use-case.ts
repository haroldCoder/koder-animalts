import { Inject, Injectable } from "@nestjs/common";
import { RegisterMedicalRecordDto } from "@medical-record/presentation/dtos";
import { ResponseDto } from "@/common/domain/dto/response.dto";
import { PetIdNotFoundException, ServerErrorException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";
import { MedicalRecordReasonForVisitNotFoundException, MedicalRecordTypeNotFoundException, MedicalRecordVisitDateNotFoundException } from "@medical-record/domain/exceptions";
import type { MedicalRecordRepository } from "@medical-record/domain/ports";
import { MedicalRecordType } from "@medical-record/domain/enums";

@Injectable()
export class CreateMedicalRecordUseCase {
    constructor(
        @Inject("MedicalRecordRepository")
        private readonly medicalRecordRepository: MedicalRecordRepository,
    ) { }

    async execute(medicalRecord: RegisterMedicalRecordDto): Promise<ResponseDto<string>> {
        try {
            const { type } = medicalRecord

            await this.medicalRecordRepository.create({ ...medicalRecord, type: type as MedicalRecordType });

            return {
                statusCode: 201,
                message: 'Medical record created successfully',
            };
        } catch (error) {
            if (
                error instanceof PetIdNotFoundException ||
                error instanceof VeterinarianIdNotFoundException ||
                error instanceof MedicalRecordTypeNotFoundException ||
                error instanceof MedicalRecordReasonForVisitNotFoundException ||
                error instanceof MedicalRecordVisitDateNotFoundException
            ) throw error;
            throw new ServerErrorException("Failed to create medical record");
        }
    }
}
