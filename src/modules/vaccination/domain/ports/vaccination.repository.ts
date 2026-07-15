import { VaccinationEntity } from "@vaccination/domain/entities";

export interface FindVaccinationsCriteria {
    page?: number;
    limit?: number;
    medicalRecordId?: string;
}

export interface IVaccinationRepository {
    create(vaccination: VaccinationEntity): Promise<string>;
    findUpcomingByPetId(petId: string): Promise<VaccinationEntity[]>;
    findNextByPetId(petId: string): Promise<VaccinationEntity | null>;
    findByUserId(userId: string, criteria: FindVaccinationsCriteria): Promise<VaccinationEntity[]>;
}

