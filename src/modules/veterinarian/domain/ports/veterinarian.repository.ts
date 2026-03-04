import { CreateVeterinarianModel, VeterinarianModel, VeterinarianWithDetailsModel } from "@veterinarian/domain/models";

export interface IVeterinarianRepository {
    create(data: CreateVeterinarianModel): Promise<string>;
    findByIdWithDetails(id: string): Promise<VeterinarianWithDetailsModel | null>;
    findByUserId(userId: string): Promise<VeterinarianModel | null>;
    findClinicByVeterinarianId(veterinarianId: string): Promise<{ id: string; name: string } | null>;
}
