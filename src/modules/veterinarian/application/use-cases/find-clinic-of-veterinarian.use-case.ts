import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { ResponseDto } from "@/common/domain/dto";
import { ServerErrorException, VeterinarianIdNotExistException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class FindClinicOfVeterinarianUseCase {
    constructor(
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository
    ) { }

    async execute(veterinarianId: string): Promise<ResponseDto<any>> {
        try {
            if (!veterinarianId) {
                throw new VeterinarianIdNotFoundException();
            }

            const veterinarian = await this.veterinarianRepository.findByIdWithDetails(veterinarianId);

            if (!veterinarian) {
                throw new VeterinarianIdNotExistException();
            }

            return {
                statusCode: HttpStatus.OK,
                data: {
                    user: veterinarian.getUser(),
                    clinic: veterinarian.getClinic(),
                    specialty: veterinarian.getSpecialty(),
                    phone: veterinarian.getPhone(),
                },
            };
        } catch (error) {
            if (
                error instanceof VeterinarianIdNotExistException ||
                error instanceof VeterinarianIdNotFoundException
            ) {
                throw error;
            }
            throw new ServerErrorException("Failed to find clinic of veterinarian: " + error);
        }
    }
}
