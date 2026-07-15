import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { MedicalRecordModel } from "@medical-record/domain/models";
import type { MedicalRecordRepository } from "@medical-record/domain/ports";
import { ResponseDto } from "@/common/domain/dto";
import { ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class GetMedicalRecordByUserIdUseCase {
    constructor(
        @Inject("MedicalRecordRepository")
        private readonly medicalRecordRepository: MedicalRecordRepository,
    ) { }

    async execute(userId: string, medicalRecordId?: string): Promise<ResponseDto<MedicalRecordModel[]>> {
        try {
            if (!userId) throw new UserIdNotFoundException();

            const medicalRecords = await this.medicalRecordRepository.findByUserId(userId, medicalRecordId);

            return {
                data: medicalRecords,
                statusCode: HttpStatus.OK,
                message: "Medical records retrieved successfully",
            };
        } catch (error) {
            if (error instanceof UserIdNotFoundException) {
                throw error;
            }
            throw new ServerErrorException("Failed to get medical records by user id: " + error);
        }
    }
}
