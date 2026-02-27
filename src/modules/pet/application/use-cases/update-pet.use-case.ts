import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IPetRepository } from "@pet/domain/ports";
import { UpdatePetModel } from "@pet/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import { PetIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class UpdatePetUseCase {
    constructor(
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository
    ) { }

    async execute(id: string, params: UpdatePetModel): Promise<ResponseDto<string>> {
        if (!id) throw new PetIdNotFoundException();

        await this.petRepository.update(id, params);

        return {
            statusCode: HttpStatus.OK,
            message: "Pet updated successfully",
        };
    }
}
