import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import type { IAuthRepository } from "@auth/domain/ports";
import type { AuthenticateModel } from "@auth/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import { AuthAccountIdRequiredException, AuthEmailRequiredException, AuthProviderIdRequiredException } from "@auth/domain/exceptions";

@Injectable()
export class AuthenticateUseCase {
    constructor(
        @Inject("IAuthRepository")
        private readonly authRepository: IAuthRepository
    ) { }

    async execute(params: AuthenticateModel): Promise<ResponseDto<string>> {
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
        let account = await this.authRepository.findAccount(providerId, accountId, user.id);

        if (!account) {
            account = await this.authRepository.createAccount({
                userId: user.id,
                providerId,
                accountId,
                accessToken,
                refreshToken,
            });
        } else {
            account = await this.authRepository.updateAccount(account.id, {
                accessToken,
                refreshToken,
            });
        }

        // 3. Create Session
        const sessionToken = randomUUID();
        const sessionExpiresAt = expiresAt ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days default

        await this.authRepository.createSession({
            userId: user.id,
            token: sessionToken,
            expiresAt: sessionExpiresAt,
            ipAddress,
            userAgent,
        });

        return {
            message: "Login exitoso",
            statusCode: 200,
            data: user.id
        };
    }
}
