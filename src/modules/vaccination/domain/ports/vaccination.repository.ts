import { CreateVaccinationModel, VaccinationModel, FindVaccinationsCriteria } from "@vaccination/domain/models";

export interface IVaccinationRepository {
    create(data: CreateVaccinationModel): Promise<string>;
    findUpcomingByPetId(petId: string): Promise<VaccinationModel[]>;
    findNextByPetId(petId: string): Promise<VaccinationModel | null>;
    findByUserId(userId: string, criteria: FindVaccinationsCriteria): Promise<VaccinationModel[]>;
}

