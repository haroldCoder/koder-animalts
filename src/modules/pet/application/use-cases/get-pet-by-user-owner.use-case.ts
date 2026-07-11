import type { IPetRepository } from "@pet/domain/ports";
import { PetEntity } from "@pet/domain/entities";
import { ResponseDto } from "@/common/domain/dto";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetPetByUserOwnerUseCase {
    constructor(@Inject("IPetRepository") private readonly petRepository: IPetRepository) { }

    async execute(userId: string): Promise<ResponseDto<PetEntity[] | null>> {
        const response = await this.petRepository.findByOwnerUserId(userId);

        return {
            statusCode: HttpStatus.OK,
            message: "Pets found successfully",
            data: response,
        }
    }
}