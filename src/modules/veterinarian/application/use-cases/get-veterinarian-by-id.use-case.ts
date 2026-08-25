import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { VeterinarianEntity } from "@veterinarian/domain/entities";
import { ServerErrorException, VeterinarianIdNotExistException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";
import { ResponseDto } from "@/common/domain/dto";

@Injectable()
export class GetVeterinarianByIdUseCase {
    constructor(
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository
    ) { }

    async execute(id: string): Promise<ResponseDto<VeterinarianEntity>> {
        try {
            if (!id) {
                throw new VeterinarianIdNotFoundException();
            }

            const veterinarian = await this.veterinarianRepository.findByIdWithDetails(id);
            if (!veterinarian) {
                throw new VeterinarianIdNotExistException();
            }

            return {
                statusCode: HttpStatus.OK,
                data: veterinarian,
            };
        } catch (error) {
            if (
                error instanceof VeterinarianIdNotExistException ||
                error instanceof VeterinarianIdNotFoundException
            ) {
                throw error;
            }
            throw new ServerErrorException("Failed to find veterinarian: " + error);
        }
    }
}
