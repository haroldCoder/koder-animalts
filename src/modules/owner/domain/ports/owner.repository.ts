import { OwnerEntity } from "@owner/domain/entities";

export interface IOwnerRepository {
    create(owner: OwnerEntity): Promise<string>;
    findByUserId(userId: string): Promise<OwnerEntity | null>;
}
