import { MedicalRecordModel } from "@medical-record/domain/models";
import { MedicalRecordRepository } from "@medical-record/domain/ports";

export class GetMedicalRecordByPetIdUseCase {
    constructor(private readonly medicalRecordRepository: MedicalRecordRepository) { }

    async execute(petId: string): Promise<MedicalRecordModel[] | null> {
        return this.medicalRecordRepository.findByPetId(petId);
    }
}
