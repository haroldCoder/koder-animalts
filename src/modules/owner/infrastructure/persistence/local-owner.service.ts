import { Injectable } from "@nestjs/common";
import { IOwnerRepository } from "@owner/domain/ports";
import { OwnerEntity } from "@owner/domain/entities";
import { OwnerAlreadyExistException } from "@owner/domain/exceptions";
import { LocalStorageStore } from "@/common/infrastructure/persistence";

@Injectable()
export class LocalOwnerService implements IOwnerRepository {
    private readonly store: LocalStorageStore;

    constructor() {
        this.store = LocalStorageStore.getInstance();
    }

    async create(owner: OwnerEntity): Promise<string> {
        const existing = this.store.findOwnerByUserId(owner.getUserId());
        if (existing) throw new OwnerAlreadyExistException();

        return this.store.createOwnerProfile(owner.getUserId(), {
            phone: owner.getPhone(),
            address: owner.getAddress(),
        });
    }

    async findByUserId(userId: string): Promise<OwnerEntity | null> {
        const record = this.store.findOwnerByUserId(userId);
        if (!record) return null;

        return OwnerEntity.create({
            id: record.id,
            userId: record.userId,
            phone: record.phone,
            address: record.address,
            createdAt: new Date(record.createdAt),
            updatedAt: new Date(record.updatedAt),
        });
    }

    async findById(id: string): Promise<OwnerEntity | null> {
        const record = this.store.findOwnerByUserId(id);
        if (!record) return null;

        return OwnerEntity.create({
            id: record.id,
            userId: record.userId,
            phone: record.phone,
            address: record.address,
            createdAt: new Date(record.createdAt),
            updatedAt: new Date(record.updatedAt),
        });
    }
}
