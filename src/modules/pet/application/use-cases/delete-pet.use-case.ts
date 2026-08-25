import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IPetRepository } from "@pet/domain/ports";
import { ResponseDto } from "@/common/domain/dto";
import { PetIdNotFoundException, ServerErrorException } from "@/common/domain/exceptions";

@Injectable()
export class DeletePetUseCase {
    constructor(
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository
    ) { }

    async execute(id: string): Promise<ResponseDto<string>> {
        try {
            if (!id) throw new PetIdNotFoundException();

            await this.petRepository.delete(id);

            return {
                statusCode: HttpStatus.OK,
                message: "Pet deleted successfully",
            };
        } catch (error) {
            if (error instanceof PetIdNotFoundException) {
                throw error;
            }
            throw new ServerErrorException("Failed to delete pet: " + error);
        }
    }
}
