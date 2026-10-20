import { Inject, Injectable } from "@nestjs/common";
import type { IAuthRepository, ITokenService } from "@auth/domain/ports";
import type { AuthenticateEntity } from "@auth/domain/entities";
import { AuthResponseData, UserRoleInfo } from "@auth/domain/ports/auth.repository.types";
import { ResponseDto } from "@/common/domain/dto";
import { AuthAccountIdRequiredException, AuthEmailRequiredException, AuthProviderIdRequiredException } from "@auth/domain/exceptions";
import { ServerErrorException } from "@/common/domain/exceptions";
import { UserRole } from "@user/domain/enums";
import { getSessionExpirationDate } from "@/common/domain/constants";

@Injectable()
export class AuthenticateUseCase {
    constructor(
        @Inject("IAuthRepository")
        private readonly authRepository: IAuthRepository,
        @Inject("ITokenService")
        private readonly tokenService: ITokenService,
    ) { }

    async execute(params: AuthenticateEntity): Promise<ResponseDto<AuthResponseData>> {
        try {
            const {
                email,
                name,
                image,
                providerId,
                accountId,
                accessToken,
                refreshToken,
                expiresAt,
                ipAddress,
                userAgent,
            } = params;

            if (!email) throw new AuthEmailRequiredException();
            if (!providerId) throw new AuthProviderIdRequiredException();
            if (!accountId) throw new AuthAccountIdRequiredException();

            // 1. Upsert User
            const user = await this.authRepository.upsertUser(email, name, image);

            // 2. Upsert Account
            let account = await this.authRepository.findAccount(providerId, accountId, user.getId());

            if (!account) {
                account = await this.authRepository.createAccount({
                    userId: user.getId(),
                    providerId,
                    accountId,
                    accessToken,
                    refreshToken,
                });
            } else {
                account = await this.authRepository.updateAccount(account.getId(), {
                    accessToken,
                    refreshToken,
                });
            }

            // 3. Resolve role information
            const userInfo = await this.authRepository.findUserRoleInfo(user.getId());
            const role = userInfo?.role ?? UserRole.UNKNOWN;

            // 4. Generate JWT Access & Refresh Tokens
            const tokens = await this.tokenService.generateTokens({
                sub: user.getId(),
                email: user.getEmailValue(),
                role,
                clinicId: userInfo?.clinicId,
                ownerId: userInfo?.ownerId,
                veterinarianId: userInfo?.veterinarianId,
            });

            // 5. Create Session with Refresh Token (3 days default)
            const sessionExpiresAt = expiresAt ?? getSessionExpirationDate();

            await this.authRepository.createSession({
                userId: user.getId(),
                token: tokens.refreshToken,
                expiresAt: sessionExpiresAt,
                ipAddress,
                userAgent,
            });

            const userResponse: UserRoleInfo = {
                id: user.getId(),
                userId: user.getId(),
                email: user.getEmailValue(),
                name: user.getName(),
                image: user.getImage(),
                role,
                ownerId: userInfo?.ownerId,
                veterinarianId: userInfo?.veterinarianId,
                clinicId: userInfo?.clinicId,
            };

            return {
                message: "Login exitoso",
                statusCode: 200,
                data: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    user: userResponse,
                },
            };
        } catch (error) {
            if (
                error instanceof AuthEmailRequiredException ||
                error instanceof AuthProviderIdRequiredException ||
                error instanceof AuthAccountIdRequiredException
            ) {
                throw error;
            }
            throw new ServerErrorException("Failed to authenticate: " + error);
        }
    }
}
