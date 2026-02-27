import { Inject, Injectable } from "@nestjs/common";
import type { IOwnerRepository } from "@owner/domain/ports";
import { UserIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class FindOwnerByUserIdUseCase {
    constructor(
        @Inject("IOwnerRepository")
        private readonly ownerRepository: IOwnerRepository
    ) { }

    async execute(userId: string): Promise<string> {
        const owner = await this.ownerRepository.findByUserId(userId);
        if (!owner) throw new UserIdNotFoundException();
        return owner.id;
    }
}
