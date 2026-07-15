import { VeterinaryClinicSummaryModel } from "@veterinary-clinics/domain/models";
import { VeterinaryClinicEntity } from "../entities/veterinary-clinic.entity";

export interface IVeterinaryClinicRepository {
    create(data: VeterinaryClinicEntity): Promise<string>;
    findAll(): Promise<VeterinaryClinicEntity[]>;
    getSummaryByVeterinarianUserId(userId: string): Promise<VeterinaryClinicSummaryModel>;
}

