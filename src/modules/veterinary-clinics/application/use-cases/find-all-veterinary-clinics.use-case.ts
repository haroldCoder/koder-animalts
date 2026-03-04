import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVeterinaryClinicRepository } from "@veterinary-clinics/domain/ports";
import { VeterinaryClinicModel } from "@veterinary-clinics/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import { ServerErrorException } from "@/common/domain/exceptions";

@Injectable()
export class FindAllVeterinaryClinicsUseCase {
    constructor(
        @Inject("IVeterinaryClinicRepository")
        private readonly clinicRepository: IVeterinaryClinicRepository
    ) { }

    async execute(): Promise<ResponseDto<VeterinaryClinicModel[]>> {
        try {
            const clinics = await this.clinicRepository.findAll();

            return {
                statusCode: HttpStatus.OK,
                data: clinics,
            };
        } catch (error) {
            if (error.status && error.status !== 500) throw error;
            throw new ServerErrorException("Failed to retrieve veterinary clinics");
        }
    }
}
