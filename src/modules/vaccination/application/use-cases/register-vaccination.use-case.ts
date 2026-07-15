import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVaccinationRepository } from "@vaccination/domain/ports";
import { RegisterVaccinationDto } from "@vaccination/presentation/dtos";
import { ResponseDto } from "@/common/domain/dto";
import { VaccinationEntity } from "@vaccination/domain/entities";
import {
    VaccinationNameNotFoundException,
} from "@vaccination/domain/exceptions";
import { ServerErrorException } from "@/common/domain/exceptions";
import { MedicalRecordVisitDateNotFoundException } from "@medical-record/domain/exceptions";

@Injectable()
export class RegisterVaccinationUseCase {
    constructor(
        @Inject("IVaccinationRepository")
        private readonly vaccinationRepository: IVaccinationRepository,
        @Inject("IIdGenerator")
        private readonly generateId: () => string,
    ) { }

    async execute(params: RegisterVaccinationDto): Promise<ResponseDto<string>> {
        try {
            const id = this.generateId();
            const vaccination = VaccinationEntity.create({
                id,
                vaccineName: params.vaccineName,
                dateAdministered: params.dateAdministered ?? new Date(),
                nextDueDate: params.nextDueDate ?? null,
                lotNumber: params.lotNumber ?? null,
                medicalRecordId: params.medicalRecordId,
            });

            const createdId = await this.vaccinationRepository.create(vaccination);

            return {
                statusCode: HttpStatus.CREATED,
                message: "Vaccination registered successfully",
                data: createdId,
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
