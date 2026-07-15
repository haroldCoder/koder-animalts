import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVeterinaryClinicRepository } from "@veterinary-clinics/domain/ports";
import { ResponseDto } from "@/common/domain/dto";
import {
    NameClinicNotFoundException,
    EmailOrPhoneNotFoundException,
} from "@veterinary-clinics/domain/exceptions";
import { AdressNotFoundException, ServerErrorException } from "@/common/domain/exceptions";
import { VeterinaryClinicEntity } from "@veterinary-clinics/domain/entities/veterinary-clinic.entity";
import { RegisterVeterinaryClinicDto } from "@veterinary-clinics/presentation/dtos";

@Injectable()
export class CreateVeterinaryClinicUseCase {
    constructor(
        @Inject("IVeterinaryClinicRepository")
        private readonly clinicRepository: IVeterinaryClinicRepository,
        @Inject("IIdGenerator")
        private readonly generateId: () => string
    ) { }

    async execute(params: RegisterVeterinaryClinicDto): Promise<ResponseDto<string>> {
        try {
            const entity = VeterinaryClinicEntity.create({
                id: this.generateId(),
                name: params.name,
                address: params.address,
                phone: params.phone,
                email: params.email,
            });

            const id = await this.clinicRepository.create(entity);

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
            throw new ServerErrorException("Failed to create veterinary clinic: " + error);
        }
    }
}

