import { Inject, Injectable } from "@nestjs/common";
import type { IAuthRepository } from "@auth/domain/ports";
import { ResponseDto } from "@/common/domain/dto";
import { ServerErrorException } from "@/common/domain/exceptions";

@Injectable()
export class LogoutUseCase {
    constructor(
        @Inject("IAuthRepository")
        private readonly authRepository: IAuthRepository,
    ) { }

    async execute(params: {
        refreshToken?: string;
        userId?: string;
    }): Promise<ResponseDto<null>> {
        try {
            if (params.refreshToken) {
                await this.authRepository.deleteSessionByToken(params.refreshToken);
            } else if (params.userId) {
                await this.authRepository.deleteSessionsByUserId(params.userId);
            }

            return {
                message: "Sesión cerrada exitosamente",
                statusCode: 200,
                data: null,
            };
        } catch (error) {
            throw new ServerErrorException("Failed to logout: " + error);
        }
    }
}
