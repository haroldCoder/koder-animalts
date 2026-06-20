import { Inject, Injectable } from "@nestjs/common";
import type { IPetRepository } from "@pet/domain/ports";
import { PetModel } from "@pet/domain/models";
import { ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class GetPetByVeterinarianUserIdUseCase {
    constructor(
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository,
    ) { }

    async execute(userId: string, petName?: string, ownerName?: string): Promise<PetModel[] | null> {
        try {
            return await this.petRepository.findByVeterinarianUserId(userId, petName, ownerName);
        } catch (error) {
            if (error instanceof UserIdNotFoundException) {
                throw error;
            }
            throw new ServerErrorException('Error to get pet by veterinarian user id' + error)
        }
    }
}
