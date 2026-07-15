import { Inject, Injectable } from "@nestjs/common";
import { MedicalRecordModel } from "@medical-record/domain/models";
import type { MedicalRecordRepository } from "@medical-record/domain/ports";
import { PetIdNotFoundException, ServerErrorException } from "@/common/domain/exceptions";

@Injectable()
export class GetMedicalRecordByPetIdUseCase {
    constructor(
        @Inject("MedicalRecordRepository")
        private readonly medicalRecordRepository: MedicalRecordRepository
    ) { }

    async execute(petId: string): Promise<MedicalRecordModel[] | null> {
        try {
            if (!petId) throw new PetIdNotFoundException();

            return await this.medicalRecordRepository.findByPetId(petId);
        } catch (error) {
            if (error instanceof PetIdNotFoundException) {
                throw error;
            }
            throw new ServerErrorException("Failed to get medical records by pet id: " + error);
        }
    }
}
