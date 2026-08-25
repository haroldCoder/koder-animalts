import { VaccinationEntity } from "@vaccination/domain/entities";
import { ResponseVaccinationDto } from "../dtos";

export interface FindVaccinationsCriteria {
    page?: number;
    limit?: number;
    medicalRecordId?: string;
    petId?: string;
}

export interface IVaccinationRepository {
    create(vaccination: VaccinationEntity): Promise<string>;
    findUpcomingByPetId(petId: string): Promise<VaccinationEntity[]>;
    findNextByPetId(petId: string): Promise<VaccinationEntity | null>;
    findByUserId(userId: string, criteria: FindVaccinationsCriteria): Promise<ResponseVaccinationDto[]>;
}
