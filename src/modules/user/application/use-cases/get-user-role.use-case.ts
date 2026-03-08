import { Inject, Injectable } from "@nestjs/common";
import type { IUserRepository } from "@user/domain/ports";
import { UserWithRoleModel } from "@user/domain/models";
import { ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class GetUserRoleUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository
    ) { }

    async execute(userId: string): Promise<UserWithRoleModel> {
        try {
            const user = await this.userRepository.findById(userId);

            if (!user) {
                throw new UserIdNotFoundException();
            }
            return user;
        } catch (err) {
            if (err instanceof UserIdNotFoundException) {
                throw err;
            }
            throw new ServerErrorException('error to get user role' + err);
        }

    }
}
