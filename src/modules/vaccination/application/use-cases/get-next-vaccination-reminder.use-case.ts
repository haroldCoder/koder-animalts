import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVaccinationRepository } from "@vaccination/domain/ports";
import { VaccinationEntity } from "@vaccination/domain/entities";
import { ResponseDto } from "@/common/domain/dto";
import { PetIdNotExistException, ServerErrorException } from "@/common/domain/exceptions";

@Injectable()
export class GetNextVaccinationReminderUseCase {
    constructor(
        @Inject("IVaccinationRepository")
        private readonly vaccinationRepository: IVaccinationRepository
    ) { }

    async execute(petId: string): Promise<ResponseDto<VaccinationEntity | null>> {
        try {
            const nextVaccination = await this.vaccinationRepository.findNextByPetId(petId);

            return {
                statusCode: HttpStatus.OK,
                data: nextVaccination,
            };
        }
        catch (error) {
            if (
                error instanceof PetIdNotExistException
            ) throw error;
            throw new ServerErrorException("Failed to find next vaccination");
        }
    }
}
