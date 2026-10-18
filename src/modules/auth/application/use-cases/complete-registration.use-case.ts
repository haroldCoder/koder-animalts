import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import type { IAuthRepository, ITokenService } from "@auth/domain/ports";
import { AuthResponseData, UserRoleInfo } from "@auth/domain/ports/auth.repository.types";
import { ResponseDto } from "@/common/domain/dto";
import { UserNotExistException, ServerErrorException } from "@/common/domain/exceptions";
import { UserRole } from "@user/domain/enums";
import { getSessionExpirationDate } from "@/common/domain/constants";

@Injectable()
export class CompleteRegistrationUseCase {
    constructor(
        @Inject("IAuthRepository")
        private readonly authRepository: IAuthRepository,
        @Inject("ITokenService")
        private readonly tokenService: ITokenService,
    ) { }

    async execute(params: {
        userId: string;
        role: UserRole;
        phone: string;
        address?: string;
        clinicId?: string;
        specialty?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<ResponseDto<AuthResponseData>> {
        try {
            const {
                userId,
                role,
                phone,
                address,
                clinicId,
                specialty,
                ipAddress,
                userAgent,
            } = params;

            // 1. Verify user exists
            const userRoleInfo = await this.authRepository.findUserRoleInfo(userId);
            if (!userRoleInfo) {
                throw new UserNotExistException();
            }

            // 2. Validate and create profile based on role
            let ownerId: string | null = null;
            let veterinarianId: string | null = null;

            if (role === UserRole.OWNER) {
                if (!address) {
                    throw new BadRequestException("La dirección es requerida para propietarios");
                }
                ownerId = await this.authRepository.createOwnerProfile(userId, {
                    phone: phone || "",
                    address: address,
                });
            } else if (role === UserRole.VETERINARIAN) {
                if (!clinicId) {
                    throw new BadRequestException("El clinicId es requerido para veterinarios");
                }
                veterinarianId = await this.authRepository.createVeterinarianProfile(userId, {
                    clinicId,
                    phone: phone || "",
                    specialty,
                });
            } else {
                throw new BadRequestException("El rol debe ser OWNER o VETERINARIAN");
            }

            // 3. Fetch updated user role info
            const updatedUser = await this.authRepository.findUserRoleInfo(userId);
            if (!updatedUser) {
                throw new UserNotExistException();
            }

            // 4. Generate updated access and refresh tokens
            const tokens = await this.tokenService.generateTokens({
                sub: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role,
                clinicId: updatedUser.clinicId,
                ownerId: updatedUser.ownerId,
                veterinarianId: updatedUser.veterinarianId,
            });

            // 5. Create new session
            const sessionExpiresAt = getSessionExpirationDate();
            await this.authRepository.createSession({
                userId: updatedUser.id,
                token: tokens.refreshToken,
                expiresAt: sessionExpiresAt,
                ipAddress,
                userAgent,
            });

            return {
                message: "Registro completado exitosamente",
                statusCode: 200,
                data: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    user: updatedUser,
                },
            };
        } catch (error) {
            if (error instanceof UserNotExistException || error instanceof BadRequestException) {
                throw error;
            }
            throw new ServerErrorException("Error al completar el registro: " + (error as Error).message);
        }
    }
}
