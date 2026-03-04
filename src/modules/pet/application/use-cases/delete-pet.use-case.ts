import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IPetRepository } from "@pet/domain/ports";
import { ResponseDto } from "@/common/domain/dto";
import { PetIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class DeletePetUseCase {
    constructor(
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository
    ) { }

    async execute(id: string): Promise<ResponseDto<string>> {
        if (!id) throw new PetIdNotFoundException();

        await this.petRepository.delete(id);

        return {
            statusCode: HttpStatus.OK,
            message: "Pet deleted successfully",
        };
    }
}
