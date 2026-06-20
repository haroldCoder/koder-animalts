import { Inject, Injectable } from "@nestjs/common";
import type { IPetRepository } from "@pet/domain/ports";
import { PetModel } from "@pet/domain/models";
import { ServerErrorException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class GetPetByVeterinarianIdUseCase {
    constructor(
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository,
    ) { }

    async execute(veterinarianId: string): Promise<PetModel[] | null> {
        try {
            return this.petRepository.findByVeterinarianId(veterinarianId);
        } catch (error) {
            if (error instanceof VeterinarianIdNotFoundException) {
                throw error;
            }
            throw new ServerErrorException('Error to get pet by veterinarian id' + error)
        }
    }
}