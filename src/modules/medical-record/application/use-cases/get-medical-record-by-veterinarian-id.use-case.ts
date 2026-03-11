import { MedicalRecordModel } from "@medical-record/domain/models";
import { MedicalRecordRepository } from "@medical-record/domain/ports";

export class GetMedicalRecordByVeterinarianIdUseCase {
    constructor(private readonly medicalRecordRepository: MedicalRecordRepository) { }

    async execute(veterinarianId: string): Promise<MedicalRecordModel[] | null> {
        return this.medicalRecordRepository.findByVeterinarianId(veterinarianId);
    }
}