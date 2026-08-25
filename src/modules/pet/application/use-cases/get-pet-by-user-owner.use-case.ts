import type { IPetRepository } from "@pet/domain/ports";
import { PetEntity } from "@pet/domain/entities";
import { ResponseDto } from "@/common/domain/dto";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class GetPetByUserOwnerUseCase {
    constructor(@Inject("IPetRepository") private readonly petRepository: IPetRepository) { }

    async execute(userId: string): Promise<ResponseDto<PetEntity[] | null>> {
        try {
            if (!userId) throw new UserIdNotFoundException();

            const response = await this.petRepository.findByOwnerUserId(userId);

            return {
                statusCode: HttpStatus.OK,
                message: "Pets found successfully",
                data: response,
            };
        } catch (error) {
            if (error instanceof UserIdNotFoundException) {
                throw error;
            }
            throw new ServerErrorException("Failed to get pets by user owner: " + error);
        }
    }
}