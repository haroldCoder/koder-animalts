import { Inject, Injectable } from "@nestjs/common";
import type { IAuthRepository, ITokenService } from "@auth/domain/ports";
import { AuthResponseData, UserRoleInfo } from "@auth/domain/ports/auth.repository.types";
import { ResponseDto } from "@/common/domain/dto";
import { EmailAlreadyExistsException } from "@auth/domain/exceptions";
import { hashPassword } from "@auth/infrastructure/utils/hash.utils";
import { ServerErrorException } from "@/common/domain/exceptions";
import { UserRole } from "@user/domain/enums";
import { getSessionExpirationDate } from "@/common/domain/constants";

@Injectable()
export class SignUpUseCase {
    constructor(
        @Inject("IAuthRepository")
        private readonly authRepository: IAuthRepository,
        @Inject("ITokenService")
        private readonly tokenService: ITokenService,
    ) { }

    async execute(params: {
        email: string;
        name: string;
        password?: string;
        image?: string;
        ipAddress?: string;
        userAgent?: string;
        role?: UserRole;
        phone?: string;
        address?: string;
        clinicId?: string;
        specialty?: string;
    }): Promise<ResponseDto<AuthResponseData>> {
        try {
            const {
                email,
                name,
                password,
                image,
                ipAddress,
                userAgent,
                role,
                phone,
                address,
                clinicId,
                specialty,
            } = params;

            // 1. Check if user already exists
            const existingUser = await this.authRepository.findUserByEmail(email);
            if (existingUser) {
                throw new EmailAlreadyExistsException();
            }

            // 2. Create User
            const user = await this.authRepository.upsertUser(email, name, image);

            // 3. Create Account (if password is provided)
            if (password) {
                const hashedPassword = hashPassword(password);
                await this.authRepository.createAccount({
                    userId: user.getId(),
                    providerId: "credentials",
                    accountId: email,
                    password: hashedPassword,
                });
            }

            // 4. Handle initial profile creation if role was specified
            let assignedRole: UserRole = UserRole.UNKNOWN;
            let ownerId: string | null = null;
            let veterinarianId: string | null = null;

            if (role === UserRole.OWNER) {
                ownerId = await this.authRepository.createOwnerProfile(user.getId(), {
                    phone: phone || "",
                    address: address || "",
                });
                assignedRole = UserRole.OWNER;
            } else if (role === UserRole.VETERINARIAN) {
                if (clinicId) {
                    veterinarianId = await this.authRepository.createVeterinarianProfile(user.getId(), {
                        clinicId,
                        phone: phone || "",
                        specialty,
                    });
                    assignedRole = UserRole.VETERINARIAN;
                }
            }

            // 5. Generate Access & Refresh Tokens
            const tokens = await this.tokenService.generateTokens({
                sub: user.getId(),
                email: user.getEmailValue(),
                role: assignedRole,
                clinicId: clinicId ?? null,
                ownerId,
                veterinarianId,
            });

            // 6. Create Session (3 days)
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
                role: assignedRole,
                ownerId,
                veterinarianId,
                clinicId: clinicId ?? null,
            };

            return {
                message: "Registro exitoso",
                statusCode: 201,
                data: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    user: userResponse,
                },
            };
        } catch (error) {
            if (error instanceof EmailAlreadyExistsException) {
                throw error;
            }
            throw new ServerErrorException("Failed to sign up: " + error);
        }
    }
}
