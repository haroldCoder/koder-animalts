import { OwnerModel, CreateOwnerModel } from "@owner/domain/models";

export interface IOwnerRepository {
    create(owner: CreateOwnerModel): Promise<string>;
    findByUserId(userId: string): Promise<OwnerModel | null>;
}
