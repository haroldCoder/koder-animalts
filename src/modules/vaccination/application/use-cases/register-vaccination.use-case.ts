import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVaccinationRepository } from "@vaccination/domain/ports";
import { CreateVaccinationModel } from "@vaccination/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import {
    VaccinationNameNotFoundException,
} from "@vaccination/domain/exceptions";

@Injectable()
export class RegisterVaccinationUseCase {
    constructor(
        @Inject("IVaccinationRepository")
        private readonly vaccinationRepository: IVaccinationRepository
    ) { }

    async execute(params: CreateVaccinationModel): Promise<ResponseDto<string>> {
        const { vaccineName, medicalRecordId } = params;

        if (!vaccineName) throw new VaccinationNameNotFoundException();
        if (!medicalRecordId) throw new VaccinationNameNotFoundException();

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
}
