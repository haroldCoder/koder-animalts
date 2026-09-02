import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVaccinationRepository } from "@vaccination/domain/ports";
import { RegisterVaccinationDto } from "@vaccination/presentation/dtos";
import { ResponseDto } from "@/common/domain/dto";
import { VaccinationEntity } from "@vaccination/domain/entities";
import {
    VaccinationNameNotFoundException,
    VaccinationDuplicatedDateException,
} from "@vaccination/domain/exceptions";
import { RegisterVaccinationPolicy } from "@vaccination/domain/policies";
import { ServerErrorException, VeterinarianIdNotExistException } from "@/common/domain/exceptions";
import { MedicalRecordVisitDateNotFoundException } from "@medical-record/domain/exceptions";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { VaccinationDatesConflictTimeException } from "@vaccination/domain/exceptions/";

@Injectable()
export class RegisterVaccinationUseCase {
    constructor(
        @Inject("IVaccinationRepository")
        private readonly vaccinationRepository: IVaccinationRepository,
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository,
        @Inject("IIdGenerator")
        private readonly generateId: () => string,
    ) { }

    async execute(params: RegisterVaccinationDto): Promise<ResponseDto<string>> {
        try {
            const id = this.generateId();
            const veterinarian = await this.veterinarianRepository.findByUserId(params.userId);

            if (!veterinarian) {
                throw new VeterinarianIdNotExistException()
            }

            const existingVaccinationsDto = await this.vaccinationRepository.findByUserId(params.userId, {});
            const existingVaccinations = existingVaccinationsDto.map(v => VaccinationEntity.create({
                id: v.id,
                vaccineName: v.vaccineName,
                dateAdministered: new Date(v.dateAdministered),
                nextDueDate: v.nextDueDate ? new Date(v.nextDueDate) : undefined,
                lotNumber: v.lotNumber,
                medicalRecordId: v.medicalRecordId,
                veterinarianId: veterinarian.getId(),
            }));

            const dateAdministered = params.dateAdministered ?? undefined;
            const nextDueDate = params.nextDueDate ? new Date(params.nextDueDate) : undefined;

            if (!RegisterVaccinationPolicy.canRegisterByDate(existingVaccinations, dateAdministered, nextDueDate)) {
                throw new VaccinationDuplicatedDateException();
            }

            const vaccination = VaccinationEntity.create({
                id,
                vaccineName: params.vaccineName,
                dateAdministered,
                nextDueDate: params.nextDueDate,
                lotNumber: params.lotNumber ?? null,
                medicalRecordId: params.medicalRecordId,
                veterinarianId: veterinarian.getId(),
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
                error instanceof MedicalRecordVisitDateNotFoundException ||
                error instanceof VaccinationDuplicatedDateException ||
                error instanceof VaccinationDatesConflictTimeException
            ) throw error;
            throw new ServerErrorException("Failed to register vaccination");
        }
    }
}

