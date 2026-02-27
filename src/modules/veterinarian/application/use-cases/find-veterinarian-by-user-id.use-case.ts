import { Inject, Injectable } from "@nestjs/common";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { UserIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class FindVeterinarianByUserIdUseCase {
    constructor(
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository
    ) { }

    async execute(userId: string): Promise<string> {
        const veterinarian = await this.veterinarianRepository.findByUserId(userId);
        if (!veterinarian) throw new UserIdNotFoundException();
        return veterinarian.id;
    }
}
