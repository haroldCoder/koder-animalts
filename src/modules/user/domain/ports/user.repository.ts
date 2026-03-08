import { UserWithRoleModel } from "@user/domain/models";

export interface IUserRepository {
    findById(userId: string): Promise<UserWithRoleModel | null>;
}
