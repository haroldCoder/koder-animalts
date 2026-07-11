import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IOwnerRepository } from "@owner/domain/ports";
import { OwnerEntity } from "@owner/domain/entities";
import { ResponseDto } from "@/common/domain/dto";
import { ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class FindOwnerByUserIdUseCase {
    constructor(
        @Inject("IOwnerRepository")
        private readonly ownerRepository: IOwnerRepository
    ) { }

    async execute(userId: string): Promise<ResponseDto<OwnerEntity>> {
        try {
            const owner = await this.ownerRepository.findByUserId(userId);

            if (!owner) throw new UserIdNotFoundException();

            return {
                statusCode: HttpStatus.OK,
                data: owner,
            };
        } catch (error) {
            if (error instanceof UserIdNotFoundException) throw error;
            throw new ServerErrorException("find owner by user id failed: " + error);
        }
    }
}
