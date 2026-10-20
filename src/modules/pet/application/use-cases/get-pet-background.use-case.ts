import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IPetRepository } from "@pet/domain/ports";
import { PetBackgroundEntity } from "@pet/domain/entities";
import { ResponseDto } from "@/common/domain/dto";
import { PetIdNotFoundException, PetIdNotExistException, ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { PetBackgroundAccessDeniedException } from "@pet/domain/exceptions";

@Injectable()
export class GetPetBackgroundUseCase {
    constructor(
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository
    ) { }

    async execute(petId: string, userId?: string): Promise<ResponseDto<ReturnType<PetBackgroundEntity["toPrimitives"]> | null>> {
        try {
            if (!petId) throw new PetIdNotFoundException();

            if (userId) {
                const hasAccess = await this.petRepository.validateUserAccessToPet(userId, petId);
                if (!hasAccess) {
                    throw new PetBackgroundAccessDeniedException();
                }
            }

            const background = await this.petRepository.findBackgroundByPetId(petId);

            return {
                statusCode: HttpStatus.OK,
                message: background ? "Pet background retrieved successfully" : "No background found for this pet",
                data: background ? background.toPrimitives() : null,
            };
        } catch (error) {
            if (
                error instanceof PetIdNotFoundException ||
                error instanceof PetIdNotExistException ||
                error instanceof UserIdNotFoundException ||
                error instanceof PetBackgroundAccessDeniedException
            ) {
                throw error;
            }
            throw new ServerErrorException("Failed to get pet background: " + error);
        }
    }
}
