import { CreateVeterinaryClinicModel, VeterinaryClinicModel, VeterinaryClinicSummaryModel } from "@veterinary-clinics/domain/models";

export interface IVeterinaryClinicRepository {
    create(data: CreateVeterinaryClinicModel): Promise<string>;
    findAll(): Promise<VeterinaryClinicModel[]>;
    getSummaryByVeterinarianUserId(userId: string): Promise<VeterinaryClinicSummaryModel>;
}
