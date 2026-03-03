import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVeterinaryClinicRepository } from "@veterinary-clinics/domain/ports";
import { CreateVeterinaryClinicModel } from "@veterinary-clinics/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import {
    NameClinicNotFoundException,
    EmailOrPhoneNotFoundException,
} from "@veterinary-clinics/domain/exceptions";
import { AdressNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class CreateVeterinaryClinicUseCase {
    constructor(
        @Inject("IVeterinaryClinicRepository")
        private readonly clinicRepository: IVeterinaryClinicRepository
    ) { }

    async execute(params: CreateVeterinaryClinicModel): Promise<ResponseDto<string>> {
        const { name, address, phone, email } = params;

        if (!name) throw new NameClinicNotFoundException();
        if (!address) throw new AdressNotFoundException();
        if (!phone && !email) throw new EmailOrPhoneNotFoundException();

        const id = await this.clinicRepository.create(params);

        return {
            statusCode: HttpStatus.CREATED,
            message: "Veterinary clinic registered successfully",
            data: id,
        };
    }
}
