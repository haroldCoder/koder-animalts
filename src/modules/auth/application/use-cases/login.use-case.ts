import { Inject, Injectable } from "@nestjs/common";
import type { IAuthRepository, ITokenService } from "@auth/domain/ports";
import { AuthResponseData, UserRoleInfo } from "@auth/domain/ports/auth.repository.types";
import { ResponseDto } from "@/common/domain/dto";
import { InvalidCredentialsException } from "@auth/domain/exceptions";
import { verifyPassword } from "@auth/infrastructure/utils/hash.utils";
import { ServerErrorException } from "@/common/domain/exceptions";
import { UserRole } from "@user/domain/enums";
import { getSessionExpirationDate } from "@/common/domain/constants";

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject("IAuthRepository")
        private readonly authRepository: IAuthRepository,
        @Inject("ITokenService")
        private readonly tokenService: ITokenService,
    ) { }

    async execute(params: {
        email: string;
        password?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<ResponseDto<AuthResponseData>> {
        try {
            const { email, password, ipAddress, userAgent } = params;

            // 1. Find User by Email
            const user = await this.authRepository.findUserByEmail(email);
            if (!user) {
                throw new InvalidCredentialsException();
            }

            // 2. Find Credentials Account
            const account = await this.authRepository.findAccount("credentials", email, user.getId());
            if (!account || !account.getPassword()) {
                throw new InvalidCredentialsException();
            }

            // 3. Verify Password
            if (password) {
                const isPasswordValid = verifyPassword(password, account.getPassword()!);
                if (!isPasswordValid) {
                    throw new InvalidCredentialsException();
                }
            } else {
                throw new InvalidCredentialsException();
            }

            // 4. Resolve User Role Information (VETERINARIAN or OWNER)
            const userInfo = await this.authRepository.findUserRoleInfo(user.getId());
            const role = userInfo?.role ?? UserRole.UNKNOWN;

            // 5. Generate Access & Refresh Tokens
            const tokens = await this.tokenService.generateTokens({
                sub: user.getId(),
                email: user.getEmailValue(),
                role,
                clinicId: userInfo?.clinicId,
                ownerId: userInfo?.ownerId,
                veterinarianId: userInfo?.veterinarianId,
            });

            // 6. Create Session in Database with Refresh Token (3 days)
            const sessionExpiresAt = getSessionExpirationDate();

            await this.authRepository.createSession({
                userId: user.getId(),
                token: tokens.refreshToken,
                expiresAt: sessionExpiresAt,
                ipAddress,
                userAgent,
            });

            const userResponse: UserRoleInfo = {
                id: user.getId(),
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
            if (error instanceof InvalidCredentialsException) {
                throw error;
            }
            throw new ServerErrorException("Failed to login: " + error);
        }
    }
}
