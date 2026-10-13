import { UserRole } from "@user/domain/enums";

export interface CreateAccountParams {
    userId: string;
    providerId: string;
    accountId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    password?: string | null;
}

export interface UpdateAccountParams {
    accessToken?: string | null;
    refreshToken?: string | null;
    password?: string | null;
}

export interface CreateSessionParams {
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
}

export interface UserRoleInfo {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: UserRole;
    ownerId?: string | null;
    veterinarianId?: string | null;
    clinicId?: string | null;
}

export interface AuthResponseData {
    accessToken: string;
    refreshToken: string;
    user: UserRoleInfo;
}