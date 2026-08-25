import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { VeterinarianEntity } from "@veterinarian/domain/entities";
import { ResponseDto } from "@/common/domain/dto";
import { PhoneNotFoundException, ServerErrorException, UserIdNotFoundException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";
import { ClinicIdNotFoundException, VeterinarianAlreadyExistsException } from "@veterinarian/domain/exceptions";
import type { CreateVeterinarianParams } from "../types";

@Injectable()
export class CreateVeterinarianUseCase {
    constructor(
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository,
        @Inject("IIdGenerator")
        private readonly generateId: () => string,
    ) { }

    async execute(params: CreateVeterinarianParams): Promise<ResponseDto<string>> {
        try {
            this.ensureUserIdPresent(params.userId);

            const existing = await this.veterinarianRepository.findByUserId(params.userId);

            // Domain rule: a veterinarian can only be created once per userId
            VeterinarianEntity.ensureDoesNotExist(existing);

            // Domain validation rules run inside VeterinarianEntity.create
            const veterinarian = this.buildVeterinarianEntity(params);

            const veterinarianId = await this.veterinarianRepository.create(veterinarian);

            return {
                message: "Veterinarian created successfully",
                statusCode: HttpStatus.CREATED,
                data: veterinarianId,
            };
        } catch (error) {
            if (
                error instanceof PhoneNotFoundException ||
                error instanceof UserIdNotFoundException ||
                error instanceof ClinicIdNotFoundException ||
                error instanceof VeterinarianAlreadyExistsException ||
                error instanceof VeterinarianIdNotFoundException
            ) {
                throw error;
            }
            throw new ServerErrorException("Failed to create veterinarian: " + error);
        }
    }

    private ensureUserIdPresent(userId: string): void {
        if (!userId) throw new UserIdNotFoundException();
    }

    private buildVeterinarianEntity(params: CreateVeterinarianParams): VeterinarianEntity {
        return VeterinarianEntity.create({
            id: this.generateId(),
            phone: params.phone,
            specialty: params.specialty,
            userId: params.userId,
            clinicId: params.clinicId,
        });
    }
}

