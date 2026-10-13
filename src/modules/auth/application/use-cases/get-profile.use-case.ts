import { Inject, Injectable } from "@nestjs/common";
import type { IAuthRepository } from "@auth/domain/ports";
import { UserRoleInfo } from "@auth/domain/ports/auth.repository.types";
import { ResponseDto } from "@/common/domain/dto";
import { ServerErrorException, UserNotExistException } from "@/common/domain/exceptions";

@Injectable()
export class GetProfileUseCase {
    constructor(
        @Inject("IAuthRepository")
        private readonly authRepository: IAuthRepository,
    ) { }

    async execute(userId: string): Promise<ResponseDto<UserRoleInfo>> {
        try {
            const userInfo = await this.authRepository.findUserRoleInfo(userId);
            if (!userInfo) {
                throw new UserNotExistException();
            }

            return {
                message: "Profile retrieved successfully",
                statusCode: 200,
                data: userInfo,
            };
        } catch (error) {
            if (error instanceof UserNotExistException) throw error;
            throw new ServerErrorException("Failed to get profile: " + error);
        }
    }
}
