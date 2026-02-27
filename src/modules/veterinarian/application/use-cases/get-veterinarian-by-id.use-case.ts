import { Inject, Injectable } from "@nestjs/common";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { VeterinarianWithDetailsModel } from "@veterinarian/domain/models";
import { VeterinarianIdNotExistException } from "@/common/domain/exceptions";

@Injectable()
export class GetVeterinarianByIdUseCase {
    constructor(
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository
    ) { }

    async execute(id: string): Promise<VeterinarianWithDetailsModel> {
        const veterinarian = await this.veterinarianRepository.findByIdWithDetails(id);

        if (!veterinarian) {
            throw new VeterinarianIdNotExistException();
        }

        return veterinarian;
    }
}
