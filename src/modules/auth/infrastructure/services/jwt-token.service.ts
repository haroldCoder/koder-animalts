import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthTokens, ITokenService, JwtTokenPayload } from "@auth/domain/ports/token.service";

import { SESSION_EXPIRES_IN_JWT } from "@/common/domain/constants";

@Injectable()
export class JwtTokenService implements ITokenService {
    private readonly jwtSecret: string;
    private readonly accessExpiresIn: string;
    private readonly jwtRefreshSecret: string;
    private readonly refreshExpiresIn: string;

    constructor(private readonly jwtService: JwtService) {
        this.jwtSecret = process.env.JWT_SECRET || "koder-animalts-jwt-secret-key-2026";
        this.accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "1h";
        this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || "koder-animalts-jwt-refresh-secret-key-2026";
        this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || SESSION_EXPIRES_IN_JWT;
    }

    async generateTokens(payload: JwtTokenPayload): Promise<AuthTokens> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: payload.sub,
                    email: payload.email,
                    role: payload.role,
                    clinicId: payload.clinicId ?? null,
                    ownerId: payload.ownerId ?? null,
                    veterinarianId: payload.veterinarianId ?? null,
                },
                {
                    secret: this.jwtSecret,
                    expiresIn: this.accessExpiresIn as any,
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: payload.sub,
                    type: "refresh",
                },
                {
                    secret: this.jwtRefreshSecret,
                    expiresIn: this.refreshExpiresIn as any,
                }
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async verifyAccessToken(token: string): Promise<JwtTokenPayload> {
        try {
            return await this.jwtService.verifyAsync<JwtTokenPayload>(token, {
                secret: this.jwtSecret,
            });
        } catch {
            throw new UnauthorizedException("Token access invalid or expired");
        }
    }

    async verifyRefreshToken(token: string): Promise<{ sub: string; type: string }> {
        try {
            return await this.jwtService.verifyAsync<{ sub: string; type: string }>(token, {
                secret: this.jwtRefreshSecret,
            });
        } catch {
            throw new UnauthorizedException("Refresh token invalid or expired");
        }
    }
}
