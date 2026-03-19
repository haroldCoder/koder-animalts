import { IPetRepository } from "@pet/domain/ports";
import { PetModel } from "@pet/domain/models";
import { PetOwnerIdNotFoundException } from "@pet/domain/exceptions";
import { ServerErrorException } from "@/common/domain/exceptions";

export class GetPetByOwnerIdUseCase {
    constructor(private readonly petRepository: IPetRepository) { }

    async execute(ownerId: string): Promise<PetModel[] | null> {
        try {
            return this.petRepository.findByOwnerId(ownerId);
        } catch (error) {
            if (error instanceof PetOwnerIdNotFoundException) {
                throw error;
            }
            throw new ServerErrorException('Error to get pet by owner id' + error)
        }
    }
}
