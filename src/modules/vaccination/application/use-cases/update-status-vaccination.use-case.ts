import { ResponseDto } from "@/common/domain/dto";
import { ServerErrorException } from "@/common/domain/exceptions";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { VaccinationStatus } from "@vaccination/domain/enums";
import { DateFutureStatusChangeException, StatusAlreadyChangedException, VaccinationNotFoundException } from "@vaccination/domain/exceptions";
import type { IVaccinationRepository } from "@vaccination/domain/ports";

@Injectable()
export class UpdateStatusVaccinationUseCase {
    constructor(
        @Inject("IVaccinationRepository")
        private readonly vaccinationRepository: IVaccinationRepository,
    ) { }

    async execute(id: string, status: VaccinationStatus): Promise<ResponseDto<string>> {
        try {
            const vaccination = await this.vaccinationRepository.findById(id);
            if (!vaccination) {
                throw new VaccinationNotFoundException();
            }

            vaccination.changeStatus(status);

            await this.vaccinationRepository.updateStatus(id, vaccination.getStatus());

            return {
                statusCode: HttpStatus.OK,
                message: "Vaccination status updated successfully",
                data: id,
            };
        }
        catch (error) {
            if (error instanceof VaccinationNotFoundException ||
                error instanceof DateFutureStatusChangeException ||
                error instanceof StatusAlreadyChangedException
            ) {
                throw error;
            }
            throw new ServerErrorException("Error updating vaccination status");
        }
    }
}