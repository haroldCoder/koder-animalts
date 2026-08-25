import { VeterinarianEntity } from "@veterinarian/domain/entities";

export interface IVeterinarianRepository {
    create(veterinarian: VeterinarianEntity): Promise<string>;
    findByIdWithDetails(id: string): Promise<VeterinarianEntity | null>;
    findByUserId(userId: string): Promise<VeterinarianEntity | null>;
    findClinicByVeterinarianId(veterinarianId: string): Promise<{ id: string; name: string } | null>;
}
