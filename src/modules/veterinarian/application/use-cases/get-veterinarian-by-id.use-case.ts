import { Inject, Injectable } from "@nestjs/common";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { VeterinarianWithDetailsModel } from "@veterinarian/domain/models";
import { ServerErrorException, VeterinarianIdNotExistException } from "@/common/domain/exceptions";
import { ResponseDto } from "@/common/domain/dto";

@Injectable()
export class GetVeterinarianByIdUseCase {
    constructor(
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository
    ) { }

    async execute(id: string): Promise<ResponseDto<VeterinarianWithDetailsModel | null>> {
        try {
            const veterinarian = await this.veterinarianRepository.findByIdWithDetails(id);
            return {
                statusCode: 200,
                data: veterinarian,
            };
        }
        catch (error) {
            if (
                error instanceof VeterinarianIdNotExistException
            ) throw error;
            throw new ServerErrorException("Failed to find veterinarian");
        }
    }
}
