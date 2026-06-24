import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IPetRepository } from "@pet/domain/ports";
import { CreatePetModel } from "@pet/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import {
    PetClinicIdNotFoundException,
    PetMainImageNotFoundException,
    PetNameNotFoundException,
    PetSpeciesNotFoundException
} from "@pet/domain/exceptions";
import { UserIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class RegisterPetUseCase {
    constructor(
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository
    ) { }

    async execute(params: CreatePetModel, userId: string): Promise<ResponseDto<string>> {
        const { mainImage, name, species, clinicId } = params;

        if (!mainImage) throw new PetMainImageNotFoundException();
        if (!name) throw new PetNameNotFoundException();
        if (!species) throw new PetSpeciesNotFoundException();
        if (!userId) throw new UserIdNotFoundException();
        if (!clinicId) throw new PetClinicIdNotFoundException();

        const petCreated = await this.petRepository.create(params, userId);

        return {
            statusCode: HttpStatus.CREATED,
            message: "Pet registered successfully",
            data: petCreated,
        };
    }
}
