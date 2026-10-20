import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { IAuthRepository, ITokenService } from "@auth/domain/ports";
import { AuthResponseData, UserRoleInfo } from "@auth/domain/ports/auth.repository.types";
import { ResponseDto } from "@/common/domain/dto";
import { ServerErrorException } from "@/common/domain/exceptions";
import { getSessionExpirationDate } from "@/common/domain/constants";

@Injectable()
export class RefreshTokenUseCase {
    constructor(
        @Inject("IAuthRepository")
        private readonly authRepository: IAuthRepository,
        @Inject("ITokenService")
        private readonly tokenService: ITokenService,
    ) { }

    async execute(params: {
        refreshToken: string;
    }): Promise<ResponseDto<AuthResponseData>> {
        try {
            const { refreshToken } = params;

            if (!refreshToken) {
                throw new BadRequestException("El refresh token es requerido");
            }

            // 1. Verify token signature and expiration
            const decoded = await this.tokenService.verifyRefreshToken(refreshToken);
            const userId = decoded.sub;

            // 2. Validate session in DB
            const session = await this.authRepository.findSessionByToken(refreshToken);
            if (!session || session.isExpired()) {
                throw new UnauthorizedException("Invalid or expired session. Please log in again.");
            }

            // 3. Get User Role info
            const userInfo = await this.authRepository.findUserRoleInfo(userId);
            if (!userInfo) {
                throw new UnauthorizedException("User not found.");
            }

            // 4. Generate new pair of tokens
            const newTokens = await this.tokenService.generateTokens({
                sub: userInfo.id,
                email: userInfo.email,
                role: userInfo.role,
                clinicId: userInfo.clinicId,
                ownerId: userInfo.ownerId,
                veterinarianId: userInfo.veterinarianId,
            });

            // 5. Update session in DB with new refresh token (token rotation, 3 days)
            const newExpiresAt = getSessionExpirationDate();
            await this.authRepository.updateSessionToken(session.getId(), newTokens.refreshToken, newExpiresAt);

            const userResponse: UserRoleInfo = {
                id: userInfo.id,
                userId: userInfo.userId || userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                image: userInfo.image,
                role: userInfo.role,
                ownerId: userInfo.ownerId,
                veterinarianId: userInfo.veterinarianId,
                clinicId: userInfo.clinicId,
            };

            return {
                message: "Tokens refreshed successfully",
                statusCode: 200,
                data: {
                    accessToken: newTokens.accessToken,
                    refreshToken: newTokens.refreshToken,
                    user: userResponse,
                },
            };
        } catch (error) {
            if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
                throw error;
            }
            throw new ServerErrorException("Failed to refresh token: " + error);
        }
    }
}
