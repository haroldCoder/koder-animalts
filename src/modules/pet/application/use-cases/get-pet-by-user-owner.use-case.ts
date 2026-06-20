import type { IPetRepository } from "@pet/domain/ports";
import { PetModel } from "@pet/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetPetByUserOwnerUseCase {
    constructor(@Inject("IPetRepository") private readonly petRepository: IPetRepository) { }

    async execute(userId: string): Promise<ResponseDto<PetModel[] | null>> {
        const response = await this.petRepository.findByOwnerUserId(userId);

        return {
            statusCode: HttpStatus.OK,
            message: "Pets found successfully",
            data: response,
        }
    }
}