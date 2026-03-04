import { CreateVeterinaryClinicModel, VeterinaryClinicModel } from "@veterinary-clinics/domain/models";

export interface IVeterinaryClinicRepository {
    create(data: CreateVeterinaryClinicModel): Promise<string>;
    findAll(): Promise<VeterinaryClinicModel[]>;
}
