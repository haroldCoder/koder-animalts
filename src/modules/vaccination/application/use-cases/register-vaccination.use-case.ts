import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVaccinationRepository } from "@vaccination/domain/ports";
import { CreateVaccinationModel } from "@vaccination/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import {
    VaccinationNameNotFoundException,
} from "@vaccination/domain/exceptions";
import { ServerErrorException } from "@/common/domain/exceptions";
import { MedicalRecordVisitDateNotFoundException } from "@medical-record/domain/exceptions";

@Injectable()
export class RegisterVaccinationUseCase {
    constructor(
        @Inject("IVaccinationRepository")
        private readonly vaccinationRepository: IVaccinationRepository
    ) { }

    async execute(params: CreateVaccinationModel): Promise<ResponseDto<string>> {
        try {
            const id = await this.vaccinationRepository.create({
                ...params,
                dateAdministered: params.dateAdministered ?? new Date(),
            });

            return {
                statusCode: HttpStatus.CREATED,
                message: "Vaccination registered successfully",
                data: id,
            };
        }
        catch (error) {
            if (
                error instanceof VaccinationNameNotFoundException ||
                error instanceof MedicalRecordVisitDateNotFoundException
            ) throw error;
            throw new ServerErrorException("Failed to register vaccination");
        }
    }
}
