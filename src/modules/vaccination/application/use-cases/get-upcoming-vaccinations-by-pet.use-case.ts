import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVaccinationRepository } from "@vaccination/domain/ports";
import { VaccinationModel } from "@vaccination/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import { PetIdNotExistException, ServerErrorException } from "@/common/domain/exceptions";

@Injectable()
export class GetUpcomingVaccinationsByPetUseCase {
    constructor(
        @Inject("IVaccinationRepository")
        private readonly vaccinationRepository: IVaccinationRepository
    ) { }

    async execute(petId: string): Promise<ResponseDto<VaccinationModel[]>> {
        try {
            const vaccinations = await this.vaccinationRepository.findUpcomingByPetId(petId);

            return {
                statusCode: HttpStatus.OK,
                data: vaccinations,
            };
        }
        catch (error) {
            if (
                error instanceof PetIdNotExistException
            ) throw error;
            throw new ServerErrorException("Failed to find upcoming vaccinations");
        }
    }
}
