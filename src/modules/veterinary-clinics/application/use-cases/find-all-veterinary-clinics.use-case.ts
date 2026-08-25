import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVeterinaryClinicRepository } from "@veterinary-clinics/domain/ports";
import { ResponseDto } from "@/common/domain/dto";
import { ServerErrorException } from "@/common/domain/exceptions";
import { VeterinaryClinicEntity } from "@veterinary-clinics/domain/entities/veterinary-clinic.entity";

@Injectable()
export class FindAllVeterinaryClinicsUseCase {
    constructor(
        @Inject("IVeterinaryClinicRepository")
        private readonly clinicRepository: IVeterinaryClinicRepository
    ) { }

    async execute(): Promise<ResponseDto<VeterinaryClinicEntity[]>> {
        try {
            const clinics = await this.clinicRepository.findAll();

            return {
                statusCode: HttpStatus.OK,
                data: clinics,
            };
        } catch (error) {
            if (error.status && error.status !== 500) throw error;
            throw new ServerErrorException("Failed to retrieve veterinary clinics: " + error);
        }
    }
}

