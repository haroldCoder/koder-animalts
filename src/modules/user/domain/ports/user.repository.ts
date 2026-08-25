import { UserWithRoleEntity } from "../entities";

export interface UserMetadata {
    user: UserWithRoleEntity,
    userType: string
}

export interface IUserRepository {
    findById(userId: string): Promise<UserMetadata | null>;
}
