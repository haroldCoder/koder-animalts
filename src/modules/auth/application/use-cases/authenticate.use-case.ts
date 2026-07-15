import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import type { IAuthRepository } from "@auth/domain/ports";
import type { AuthenticateEntity } from "@auth/domain/entities";
import { ResponseDto } from "@/common/domain/dto";
import { AuthAccountIdRequiredException, AuthEmailRequiredException, AuthProviderIdRequiredException } from "@auth/domain/exceptions";
import { ServerErrorException } from "@/common/domain/exceptions";

@Injectable()
export class AuthenticateUseCase {
    constructor(
        @Inject("IAuthRepository")
        private readonly authRepository: IAuthRepository
    ) { }

    async execute(params: AuthenticateEntity): Promise<ResponseDto<string>> {
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

            // 3. Create Session
            const sessionToken = randomUUID();
            const sessionExpiresAt = expiresAt ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days default

            await this.authRepository.createSession({
                userId: user.getId(),
                token: sessionToken,
                expiresAt: sessionExpiresAt,
                ipAddress,
                userAgent,
            });

            return {
                message: "Login exitoso",
                statusCode: 200,
                data: user.getId()
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
