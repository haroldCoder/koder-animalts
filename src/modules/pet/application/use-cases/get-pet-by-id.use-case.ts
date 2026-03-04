import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IPetRepository } from "@pet/domain/ports";
import { PetModel } from "@pet/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import { PetIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class GetPetByIdUseCase {
    constructor(
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository
    ) { }

    async execute(id: string): Promise<ResponseDto<PetModel>> {
        if (!id) throw new PetIdNotFoundException();

        const pet = await this.petRepository.findById(id);

        if (!pet) throw new PetIdNotFoundException();

        return {
            statusCode: HttpStatus.OK,
            data: pet,
        };
    }
}
