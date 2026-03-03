import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVeterinaryClinicRepository } from "@veterinary-clinics/domain/ports";
import { VeterinaryClinicModel } from "@veterinary-clinics/domain/models";
import { ResponseDto } from "@/common/domain/dto";

@Injectable()
export class FindAllVeterinaryClinicsUseCase {
    constructor(
        @Inject("IVeterinaryClinicRepository")
        private readonly clinicRepository: IVeterinaryClinicRepository
    ) { }

    async execute(): Promise<ResponseDto<VeterinaryClinicModel[]>> {
        const clinics = await this.clinicRepository.findAll();

        return {
            statusCode: HttpStatus.OK,
            data: clinics,
        };
    }
}
