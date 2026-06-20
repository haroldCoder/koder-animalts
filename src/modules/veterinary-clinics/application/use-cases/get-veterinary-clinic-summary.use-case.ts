import { Inject, Injectable } from "@nestjs/common";
import type { IVeterinaryClinicRepository } from "@veterinary-clinics/domain/ports";
import { VeterinaryClinicSummaryModel } from "@veterinary-clinics/domain/models";
import { ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { VeterinaryClinicNotFoundException } from "@veterinary-clinics/domain/exceptions";

@Injectable()
export class GetVeterinaryClinicSummaryUseCase {
    constructor(
        @Inject("IVeterinaryClinicRepository")
        private readonly veterinaryClinicRepository: IVeterinaryClinicRepository,
    ) { }

    async execute(userId: string): Promise<VeterinaryClinicSummaryModel> {
        try {
            return await this.veterinaryClinicRepository.getSummaryByVeterinarianUserId(userId);
        } catch (error) {
            if (error instanceof VeterinaryClinicNotFoundException || error instanceof UserIdNotFoundException) {
                throw error;
            }
            throw new ServerErrorException('Error to get veterinary clinic summary ' + error)
        }
    }
}
