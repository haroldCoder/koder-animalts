import { VeterinaryClinicSummaryModel } from "@veterinary-clinics/domain/models";
import { VeterinaryClinicEntity } from "../entities/veterinary-clinic.entity";
import { ResponseFindVeterinariansDto } from "../dtos";

export interface IVeterinaryClinicRepository {
    create(data: VeterinaryClinicEntity): Promise<string>;
    findAll(): Promise<VeterinaryClinicEntity[]>;
    findById(id: string): Promise<VeterinaryClinicEntity | null>;
    findAllVeterinariansOfClinic(clinicId: string): Promise<ResponseFindVeterinariansDto[]>;
    getSummaryByVeterinarianUserId(userId: string): Promise<VeterinaryClinicSummaryModel>;
}

