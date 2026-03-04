import { Inject, Injectable } from "@nestjs/common";
import type { IOwnerRepository } from "@owner/domain/ports";
import { ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { ResponseDto } from "@/common/domain/dto";
import { OwnerModel } from "@owner/domain/models";

@Injectable()
export class FindOwnerByUserIdUseCase {
    constructor(
        @Inject("IOwnerRepository")
        private readonly ownerRepository: IOwnerRepository
    ) { }

    async execute(userId: string): Promise<ResponseDto<OwnerModel | null>> {
        try {
            const owner = await this.ownerRepository.findByUserId(userId);

            return {
                statusCode: 200,
                data: owner || null,
            };
        } catch (error) {
            if (
                error instanceof UserIdNotFoundException
            ) throw error;
            throw new ServerErrorException("find owner by user id failed" + error);
        }
    }
}
