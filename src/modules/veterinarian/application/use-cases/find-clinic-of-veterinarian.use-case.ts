import { Inject, Injectable } from "@nestjs/common";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { ResponseDto } from "@/common/domain/dto";
import { VeterinarianIdNotFoundException, VeterinarianIdNotExistException } from "@/common/domain/exceptions";

@Injectable()
export class FindClinicOfVeterinarianUseCase {
    constructor(
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository
    ) { }

    async execute(veterinarianId: string): Promise<ResponseDto<any>> {
        if (!veterinarianId) throw new VeterinarianIdNotFoundException();

        const data = await this.veterinarianRepository.findByIdWithDetails(veterinarianId);
        if (!data) throw new VeterinarianIdNotExistException();

        return {
            message: "Veterinarian found successfully",
            statusCode: 200,
            data: {
                user: data.user,
                clinic: data.clinic,
                specialty: data.specialty,
                phone: data.phone,
            },
        };
    }
}
