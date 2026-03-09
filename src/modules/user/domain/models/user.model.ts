export enum UserRole {
    OWNER = 'OWNER',
    VETERINARIAN = 'VETERINARIAN',
    UNKNOWN = 'UNKNOWN',
}

export class UserWithRoleModel {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: UserRole;
}
