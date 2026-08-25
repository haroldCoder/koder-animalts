import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { ResponseDto } from "@/common/domain/dto";
import { VeterinarianEntity } from "@veterinarian/domain/entities";

@Injectable()
export class FindVeterinarianByUserIdUseCase {
    constructor(
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository
    ) { }

    async execute(userId: string): Promise<ResponseDto<VeterinarianEntity>> {
        try {
            if (!userId) {
                throw new UserIdNotFoundException();
            }

            const veterinarian = await this.veterinarianRepository.findByUserId(userId);
            if (!veterinarian) {
                throw new UserIdNotFoundException();
            }

            return {
                statusCode: HttpStatus.OK,
                data: veterinarian,
            };
        } catch (error) {
            if (error instanceof UserIdNotFoundException) {
                throw error;
            }
            throw new ServerErrorException("Failed to find veterinarian: " + error);
        }
    }
}
