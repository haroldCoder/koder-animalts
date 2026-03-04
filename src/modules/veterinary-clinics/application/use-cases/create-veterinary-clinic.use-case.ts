import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVeterinaryClinicRepository } from "@veterinary-clinics/domain/ports";
import { CreateVeterinaryClinicModel } from "@veterinary-clinics/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import {
    NameClinicNotFoundException,
    EmailOrPhoneNotFoundException,
} from "@veterinary-clinics/domain/exceptions";
import { AdressNotFoundException, ServerErrorException } from "@/common/domain/exceptions";

@Injectable()
export class CreateVeterinaryClinicUseCase {
    constructor(
        @Inject("IVeterinaryClinicRepository")
        private readonly clinicRepository: IVeterinaryClinicRepository
    ) { }

    async execute(params: CreateVeterinaryClinicModel): Promise<ResponseDto<string>> {
        try {
            const id = await this.clinicRepository.create(params);

            return {
                statusCode: HttpStatus.CREATED,
                message: "Veterinary clinic registered successfully",
                data: id,
            };
        }
        catch (error) {
            if (
                error instanceof NameClinicNotFoundException ||
                error instanceof AdressNotFoundException ||
                error instanceof EmailOrPhoneNotFoundException
            ) throw error;
            throw new ServerErrorException("Failed to create veterinary clinic");
        }
    }
}
