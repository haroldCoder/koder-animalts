import { CreatePetModel, PetModel, UpdatePetModel } from "@pet/domain/models";

export interface IPetRepository {
    create(data: CreatePetModel, userId: string): Promise<string>;
    update(id: string, data: UpdatePetModel): Promise<string>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<PetModel | null>;
    findByVeterinarianId(veterinarianId: string): Promise<PetModel[] | null>;
    findByOwnerId(ownerId: string): Promise<PetModel[] | null>;
    findByOwnerUserId(userId: string): Promise<PetModel[] | null>;
    findByVeterinarianUserId(userId: string, petName?: string, ownerName?: string): Promise<PetModel[] | null>;
}
