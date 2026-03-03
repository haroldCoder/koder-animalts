import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVaccinationRepository } from "@vaccination/domain/ports";
import { VaccinationModel } from "@vaccination/domain/models";
import { ResponseDto } from "@/common/domain/dto";

@Injectable()
export class GetNextVaccinationReminderUseCase {
    constructor(
        @Inject("IVaccinationRepository")
        private readonly vaccinationRepository: IVaccinationRepository
    ) { }

    async execute(petId: string): Promise<ResponseDto<VaccinationModel | null>> {
        const nextVaccination = await this.vaccinationRepository.findNextByPetId(petId);

        return {
            statusCode: HttpStatus.OK,
            data: nextVaccination,
        };
    }
}
