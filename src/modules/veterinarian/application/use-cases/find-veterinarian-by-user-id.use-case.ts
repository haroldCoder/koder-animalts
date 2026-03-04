import { Inject, Injectable } from "@nestjs/common";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { ResponseDto } from "@/common/domain/dto";
import { VeterinarianModel } from "@veterinarian/domain/models";

@Injectable()
export class FindVeterinarianByUserIdUseCase {
    constructor(
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository
    ) { }

    async execute(userId: string): Promise<ResponseDto<VeterinarianModel>> {
        try {
            const veterinarian = await this.veterinarianRepository.findByUserId(userId);
            if (!veterinarian) throw new UserIdNotFoundException();
            return {
                statusCode: 200,
                data: veterinarian,
            };
        }
        catch (error) {
            if (
                error instanceof UserIdNotFoundException
            ) throw error;
            throw new ServerErrorException("Failed to find veterinarian");
        }
    }
}
