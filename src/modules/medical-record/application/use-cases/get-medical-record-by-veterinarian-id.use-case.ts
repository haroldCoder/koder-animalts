import { Inject, Injectable } from "@nestjs/common";
import { MedicalRecordModel } from "@medical-record/domain/models";
import type { MedicalRecordRepository } from "@medical-record/domain/ports";
import { ServerErrorException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class GetMedicalRecordByVeterinarianIdUseCase {
    constructor(
        @Inject("MedicalRecordRepository")
        private readonly medicalRecordRepository: MedicalRecordRepository
    ) { }

    async execute(veterinarianId: string): Promise<MedicalRecordModel[] | null> {
        try {
            if (!veterinarianId) throw new VeterinarianIdNotFoundException();

            return await this.medicalRecordRepository.findByVeterinarianId(veterinarianId);
        } catch (error) {
            if (error instanceof VeterinarianIdNotFoundException) {
                throw error;
            }
            throw new ServerErrorException("Failed to get medical records by veterinarian id: " + error);
        }
    }
}