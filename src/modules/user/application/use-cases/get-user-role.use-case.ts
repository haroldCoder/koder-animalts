import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IUserRepository, UserMetadata } from "@user/domain/ports";
import { ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { ResponseDto } from "@/common/domain/dto";

@Injectable()
export class GetUserRoleUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository
    ) { }

    async execute(userId: string): Promise<ResponseDto<UserMetadata>> {
        try {
            const user = await this.userRepository.findById(userId);

            if (!user) {
                throw new UserIdNotFoundException();
            }
            return {
                message: "User role fetched successfully",
                data: user,
                statusCode: HttpStatus.OK
            };
        } catch (err) {
            if (err instanceof UserIdNotFoundException) {
                throw err;
            }
            throw new ServerErrorException('error to get user role' + err);
        }

    }
}
