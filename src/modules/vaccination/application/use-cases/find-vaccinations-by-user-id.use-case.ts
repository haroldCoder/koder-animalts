import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVaccinationRepository, FindVaccinationsCriteria } from "@vaccination/domain/ports";
import { VaccinationEntity } from "@vaccination/domain/entities";
import { ResponseDto } from "@/common/domain/dto";
import { UserIdNotFoundException, ServerErrorException } from "@/common/domain/exceptions";
import { ResponseVaccinationDto } from "@vaccination/domain/dtos";

@Injectable()
export class FindVaccinationsByUserIdUseCase {
    constructor(
        @Inject("IVaccinationRepository")
        private readonly vaccinationRepository: IVaccinationRepository
    ) { }

    async execute(userId: string, criteria: FindVaccinationsCriteria): Promise<ResponseDto<ResponseVaccinationDto[]>> {
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
