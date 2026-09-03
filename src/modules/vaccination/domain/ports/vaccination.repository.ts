import { FindCriteriaQueries } from "@/common/interfaces";
import { VaccinationEntity } from "@vaccination/domain/entities";
import { ResponseVaccinationDto } from "../dtos";
import { VaccinationStatus } from "../enums";

export interface FindVaccinationsCriteria extends FindCriteriaQueries {
    medicalRecordId?: string;
    petId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: VaccinationStatus[]
}

export interface IVaccinationRepository {
    create(vaccination: VaccinationEntity): Promise<string>;
    findById(id: string): Promise<VaccinationEntity | null>;
    findUpcomingByPetId(petId: string): Promise<VaccinationEntity[]>;
    findNextByPetId(petId: string): Promise<VaccinationEntity | null>;
    findByUserId(userId: string, criteria: FindVaccinationsCriteria): Promise<ResponseVaccinationDto>;
    updateStatus(id: string, status: VaccinationStatus): Promise<void>;
}
