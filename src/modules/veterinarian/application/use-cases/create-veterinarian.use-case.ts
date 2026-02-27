import { Inject, Injectable } from "@nestjs/common";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { CreateVeterinarianModel } from "@veterinarian/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import { PhoneNotFoundException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { ClinicIdNotFoundException, VeterinarianAlreadyExistsException } from "@veterinarian/domain/exceptions";

@Injectable()
export class CreateVeterinarianUseCase {
    constructor(
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository
    ) { }

    async execute(params: CreateVeterinarianModel): Promise<ResponseDto<string>> {
        const { phone, userId, clinicId } = params;

        if (!phone) throw new PhoneNotFoundException();
        if (!userId) throw new UserIdNotFoundException();
        if (!clinicId) throw new ClinicIdNotFoundException();

        // Check if veterinarian already exists for this user
        const existing = await this.veterinarianRepository.findByUserId(userId);
        if (existing) throw new VeterinarianAlreadyExistsException();

        const veterinarianCreated = await this.veterinarianRepository.create(params);

        return {
            message: "Veterinarian created successfully",
            statusCode: 201,
            data: veterinarianCreated,
        };
    }
}
