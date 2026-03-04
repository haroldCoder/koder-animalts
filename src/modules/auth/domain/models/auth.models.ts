export class AuthenticateModel {
    email: string;
    name?: string;
    image?: string;
    providerId: string;
    accountId: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    ipAddress?: string;
    userAgent?: string;
}

export class UserModel {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
}

export class AccountModel {
    id: string;
    userId: string;
    providerId: string;
    accountId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
}

export class SessionModel {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
}
