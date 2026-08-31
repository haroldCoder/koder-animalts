import { HttpStatus, Injectable } from "@nestjs/common";
import { VaccinationEntity } from "@vaccination/domain/entities";
import type { IVaccinationRepository } from "@vaccination/domain/ports";
import { Inject } from "@nestjs/common";
import { ResponseDto } from "@/common/domain/dto";
import { VaccinationNotFoundException } from "@vaccination/domain/exceptions";
import { ServerErrorException } from "@/common/domain/exceptions";

@Injectable()
export class GetVaccinationByIdUseCase {
    constructor(
        @Inject("IVaccinationRepository")
        private readonly vaccinationRepository: IVaccinationRepository,
    ) { }

    async execute(id: string): Promise<ResponseDto<VaccinationEntity>> {
        try {
            const vaccination = await this.vaccinationRepository.findById(id);
            if (!vaccination) {
                throw new VaccinationNotFoundException();
            }
            return {
                statusCode: HttpStatus.OK,
                data: vaccination,
            };
        } catch (error) {
            if (error instanceof VaccinationNotFoundException) {
                throw error;
            }
            throw new ServerErrorException("Error getting vaccination by id");
        }
    }
}