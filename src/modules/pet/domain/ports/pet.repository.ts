import { PetEntity } from "@pet/domain/entities";

export interface IPetRepository {
    create(pet: PetEntity): Promise<string>;
    update(pet: PetEntity): Promise<string>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<PetEntity | null>;
    findByVeterinarianId(veterinarianId: string): Promise<PetEntity[] | null>;
    findByOwnerId(ownerId: string): Promise<PetEntity[] | null>;
    findByOwnerUserId(userId: string): Promise<PetEntity[] | null>;
    findByVeterinarianUserId(userId: string, petName?: string, ownerName?: string): Promise<PetEntity[] | null>;
    findOwnerIdByUserId(userId: string): Promise<string | null>;
}
