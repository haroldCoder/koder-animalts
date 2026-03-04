import { CreateVaccinationModel, VaccinationModel } from "@vaccination/domain/models";

export interface IVaccinationRepository {
    create(data: CreateVaccinationModel): Promise<string>;
    findUpcomingByPetId(petId: string): Promise<VaccinationModel[]>;
    findNextByPetId(petId: string): Promise<VaccinationModel | null>;
}
