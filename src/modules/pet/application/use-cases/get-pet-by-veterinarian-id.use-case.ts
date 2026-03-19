import { IPetRepository } from "@pet/domain/ports";
import { PetModel } from "@pet/domain/models";
import { ServerErrorException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";

export class GetPetByVeterinarianIdUseCase {
    constructor(private readonly petRepository: IPetRepository) { }

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