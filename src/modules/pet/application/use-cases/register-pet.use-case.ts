import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IPetRepository } from "@pet/domain/ports";
import { PetEntity } from "@pet/domain/entities";
import { ResponseDto } from "@/common/domain/dto";
import { UserIdNotFoundException } from "@/common/domain/exceptions";
import { PetOwnerIdNotFoundException } from "@pet/domain/exceptions";
import type { RegisterPetParams } from "@pet/application/types";


@Injectable()
export class RegisterPetUseCase {
    constructor(
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository,
        @Inject("IIdGenerator")
        private readonly generateId: () => string,
    ) { }

    async execute(params: RegisterPetParams, userId: string): Promise<ResponseDto<string>> {
        this.ensureUserIdPresent(userId);

        const ownerId = await this.resolveOwnerId(userId);

        const pet = this.buildPetEntity(params, ownerId);

        const petCreatedId = await this.petRepository.create(pet);

        return {
            statusCode: HttpStatus.CREATED,
            message: "Pet registered successfully",
            data: petCreatedId,
        };
    }

    private ensureUserIdPresent(userId: string): void {
        if (!userId) throw new UserIdNotFoundException();
    }

    private async resolveOwnerId(userId: string): Promise<string> {
        const ownerId = await this.petRepository.findOwnerIdByUserId(userId);
        if (!ownerId) throw new PetOwnerIdNotFoundException();
        return ownerId;
    }

    private buildPetEntity(params: RegisterPetParams, ownerId: string): PetEntity {
        // Domain validation rules are enforced inside PetEntity.create
        return PetEntity.create({
            id: this.generateId(),
            name: params.name,
            species: params.species,
            breed: params.breed,
            gender: params.gender,
            birthDate: params.birthDate,
            weight: params.weight,
            color: params.color,
            microchip: params.microchip,
            mainImage: params.mainImage,
            iaImage: params.iaImage,
            images: params.images,
            ownerId,
            clinicId: params.clinicId,
        });
    }
}
