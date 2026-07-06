export class AuthenticateEntity {
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
