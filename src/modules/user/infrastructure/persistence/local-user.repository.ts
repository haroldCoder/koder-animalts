import { Injectable } from "@nestjs/common";
import { IUserRepository, UserMetadata } from "@user/domain/ports";
import { UserWithRoleEntity } from "@user/domain/entities";
import { LocalStorageStore } from "@auth/infrastructure/persistence";

@Injectable()
export class LocalUserRepository implements IUserRepository {
    private readonly store: LocalStorageStore;

    constructor() {
        this.store = LocalStorageStore.getInstance();
    }

    async findById(userId: string): Promise<UserMetadata | null> {
        const roleInfo = this.store.findUserRoleInfo(userId);
        if (!roleInfo) return null;

        const userWithRole = UserWithRoleEntity.create({
            id: roleInfo.id,
            email: roleInfo.email,
            name: roleInfo.name,
            image: roleInfo.image,
            role: roleInfo.role,
        });

        return {
            user: userWithRole,
            userType: "user",
        };
    }
}
