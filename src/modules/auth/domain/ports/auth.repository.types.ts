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