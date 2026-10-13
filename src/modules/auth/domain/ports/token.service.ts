import { UserRole } from "@user/domain/enums";

export interface JwtTokenPayload {
    sub: string;
    email: string;
    role: UserRole;
    clinicId?: string | null;
    ownerId?: string | null;
    veterinarianId?: string | null;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface ITokenService {
    generateTokens(payload: JwtTokenPayload): Promise<AuthTokens>;
    verifyAccessToken(token: string): Promise<JwtTokenPayload>;
    verifyRefreshToken(token: string): Promise<{ sub: string; type: string }>;
}
