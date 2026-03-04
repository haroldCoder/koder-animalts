import { Inject, Injectable } from "@nestjs/common";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { CreateVeterinarianModel } from "@veterinarian/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import { PhoneNotFoundException, ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { ClinicIdNotFoundException, VeterinarianAlreadyExistsException } from "@veterinarian/domain/exceptions";

@Injectable()
export class CreateVeterinarianUseCase {
    constructor(
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository
    ) { }

    async execute(params: CreateVeterinarianModel): Promise<ResponseDto<string>> {
        try {
            const veterinarianId = await this.veterinarianRepository.create(params);

            return {
                message: "Veterinarian created successfully",
                statusCode: 201,
                data: veterinarianId,
            };
        }
        catch (error) {
            if (
                error instanceof PhoneNotFoundException ||
                error instanceof UserIdNotFoundException ||
                error instanceof ClinicIdNotFoundException ||
                error instanceof VeterinarianAlreadyExistsException
            ) throw error;
            throw new ServerErrorException("Failed to create veterinarian");
        }
    }
}
