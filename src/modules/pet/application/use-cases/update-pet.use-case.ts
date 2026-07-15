import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IPetRepository } from "@pet/domain/ports";
import { PetEntity } from "@pet/domain/entities";
import { ResponseDto } from "@/common/domain/dto";
import { PetIdNotFoundException, PetIdNotExistException, ServerErrorException } from "@/common/domain/exceptions";
import type { UpdatePetParams } from "@pet/application/types";

@Injectable()
export class UpdatePetUseCase {
    constructor(
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository
    ) { }

    async execute(id: string, params: UpdatePetParams): Promise<ResponseDto<string>> {
        try {
            this.ensureIdPresent(id);

            const pet = await this.loadPet(id);

            // Domain validations run inside updateDetails (SRP: entity owns its rules)
            pet.updateDetails(params);

            await this.petRepository.update(pet);

            return {
                statusCode: HttpStatus.OK,
                message: "Pet updated successfully",
            };
        } catch (error) {
            if (
                error instanceof PetIdNotFoundException ||
                error instanceof PetIdNotExistException
            ) {
                throw error;
            }
            throw new ServerErrorException("Failed to update pet: " + error);
        }
    }

    private ensureIdPresent(id: string): void {
        if (!id) throw new PetIdNotFoundException();
    }

    private async loadPet(id: string): Promise<PetEntity> {
        const pet = await this.petRepository.findById(id);
        if (!pet) throw new PetIdNotExistException();
        return pet;
    }
}
