import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVaccinationRepository } from "@vaccination/domain/ports";
import { VaccinationModel, FindVaccinationsCriteria } from "@vaccination/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import { UserIdNotFoundException, ServerErrorException } from "@/common/domain/exceptions";

@Injectable()
export class FindVaccinationsByUserIdUseCase {
    constructor(
        @Inject("IVaccinationRepository")
        private readonly vaccinationRepository: IVaccinationRepository
    ) { }

    async execute(userId: string, criteria: FindVaccinationsCriteria): Promise<ResponseDto<VaccinationModel[]>> {
        try {
            const vaccinations = await this.vaccinationRepository.findByUserId(userId, criteria);

            return {
                statusCode: HttpStatus.OK,
                message: "Vaccinations retrieved successfully",
                data: vaccinations,
            };
        }
        catch (error) {
            if (error instanceof UserIdNotFoundException) throw error;
            throw new ServerErrorException("Failed to find vaccinations by user id");
        }
    }
}
