import { CreatePetModel, PetModel, UpdatePetModel } from "@pet/domain/models";

export interface IPetRepository {
    create(data: CreatePetModel): Promise<string>;
    update(id: string, data: UpdatePetModel): Promise<string>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<PetModel | null>;
    findByVeterinarianId(veterinarianId: string): Promise<PetModel[] | null>;
    findByOwnerId(ownerId: string): Promise<PetModel[] | null>;
}
