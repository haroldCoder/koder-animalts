import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import type { IAuthRepository } from "@auth/domain/ports";
import { ResponseDto } from "@/common/domain/dto";
import { EmailAlreadyExistsException } from "@auth/domain/exceptions";
import { hashPassword } from "@auth/infrastructure/utils/hash.utils";

@Injectable()
export class SignUpUseCase {
    constructor(
        @Inject("IAuthRepository")
        private readonly authRepository: IAuthRepository
    ) { }

    async execute(params: {
        email: string;
        name: string;
        password?: string;
        image?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<ResponseDto<string>> {
        const { email, name, password, image, ipAddress, userAgent } = params;

        // 1. Check if user already exists
        const existingUser = await this.authRepository.findUserByEmail(email);
        if (existingUser) {
            throw new EmailAlreadyExistsException();
        }

        // 2. Create/Upsert User
        const user = await this.authRepository.upsertUser(email, name, image);

        // 3. Create Account (if password is provided)
        if (password) {
            const hashedPassword = hashPassword(password);
            await this.authRepository.createAccount({
                userId: user.id,
                providerId: "credentials",
                accountId: email,
                password: hashedPassword,
            });
        }

        // 4. Create Session
        const sessionToken = randomUUID();
        const sessionExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days default

        await this.authRepository.createSession({
            userId: user.id,
            token: sessionToken,
            expiresAt: sessionExpiresAt,
            ipAddress,
            userAgent,
        });

        return {
            message: "Registro exitoso",
            statusCode: 201,
            data: sessionToken,
        };
    }
}
