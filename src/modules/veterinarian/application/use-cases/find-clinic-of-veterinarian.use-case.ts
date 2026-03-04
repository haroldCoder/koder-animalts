import { Inject, Injectable } from "@nestjs/common";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { ResponseDto } from "@/common/domain/dto";
import { VeterinarianIdNotFoundException, VeterinarianIdNotExistException, ServerErrorException } from "@/common/domain/exceptions";

@Injectable()
export class FindClinicOfVeterinarianUseCase {
    constructor(
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository
    ) { }

    async execute(veterinarianId: string): Promise<ResponseDto<any>> {
        try {
            const data = await this.veterinarianRepository.findByIdWithDetails(veterinarianId);

            return {
                statusCode: 200,
                data: {
                    user: data?.user,
                    clinic: data?.clinic,
                    specialty: data?.specialty,
                    phone: data?.phone,
                },
            };
        }
        catch (error) {
            if (
                error instanceof VeterinarianIdNotFoundException ||
                error instanceof VeterinarianIdNotExistException
            ) throw error;
            throw new ServerErrorException("Failed to find veterinarian");
        }


    }
}
