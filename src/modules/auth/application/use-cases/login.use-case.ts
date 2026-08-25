import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import type { IAuthRepository } from "@auth/domain/ports";
import { ResponseDto } from "@/common/domain/dto";
import { InvalidCredentialsException } from "@auth/domain/exceptions";
import { verifyPassword } from "@auth/infrastructure/utils/hash.utils";
import { ServerErrorException } from "@/common/domain/exceptions";

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject("IAuthRepository")
        private readonly authRepository: IAuthRepository
    ) { }

    async execute(params: {
        email: string;
        password?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<ResponseDto<string>> {
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

            // 4. Create Session
            const sessionToken = randomUUID();
            const sessionExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days default

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
                data: user.getId(),
            };
        } catch (error) {
            if (
                error instanceof InvalidCredentialsException
            ) {
                throw error;
            }
            throw new ServerErrorException("Failed to login: " + error);
        }
    }
}
