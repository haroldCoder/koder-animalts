import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IPetRepository } from "@pet/domain/ports";
import { CreatePetModel } from "@pet/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import {
    PetClinicIdNotFoundException,
    PetMainImageNotFoundException,
    PetNameNotFoundException,
    PetOwnerIdNotFoundException,
    PetSpeciesNotFoundException
} from "@pet/domain/exceptions";

@Injectable()
export class RegisterPetUseCase {
    constructor(
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository
    ) { }

    async execute(params: CreatePetModel): Promise<ResponseDto<string>> {
        const { mainImage, name, species, ownerId, clinicId } = params;

        if (!mainImage) throw new PetMainImageNotFoundException();
        if (!name) throw new PetNameNotFoundException();
        if (!species) throw new PetSpeciesNotFoundException();
        if (!ownerId) throw new PetOwnerIdNotFoundException();
        if (!clinicId) throw new PetClinicIdNotFoundException();

        const petCreated = await this.petRepository.create(params);

        return {
            statusCode: HttpStatus.CREATED,
            message: "Pet registered successfully",
            data: petCreated,
        };
    }
}
