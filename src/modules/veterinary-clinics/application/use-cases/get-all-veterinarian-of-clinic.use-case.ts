import { Injectable } from "@nestjs/common";
import type { IVeterinaryClinicRepository } from "@veterinary-clinics/domain/ports";
import { ResponseFindVeterinariansDto } from "@veterinary-clinics/domain/dtos";
import { VeterinaryClinicIdNotFoundException } from "@veterinary-clinics/domain/exceptions";
import { Inject } from "@nestjs/common";

@Injectable()
export class GetAllVeterinarianOfClinicUseCase {
    constructor(
        @Inject("IVeterinaryClinicRepository")
        private readonly veterinaryClinicRepository: IVeterinaryClinicRepository
    ) { }

    async execute(clinicId: string): Promise<ResponseFindVeterinariansDto[]> {
        if (!clinicId) throw new VeterinaryClinicIdNotFoundException();

        return await this.veterinaryClinicRepository.findAllVeterinariansOfClinic(clinicId);
    }
}
