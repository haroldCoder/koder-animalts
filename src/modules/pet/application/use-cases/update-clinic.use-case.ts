import type { IAppointmentRepository } from "@appointment/domain/ports/appointment.repository";
import { Inject, Injectable } from "@nestjs/common";
import type { IPetRepository } from "@pet/domain/ports";
import { UpdateClinicPolicy } from "@pet/domain/policies";
import { ClinicChangeNotAllowedByAppointmentException } from "@/common/domain/exceptions";

@Injectable()
export class UpdateClinicUseCase {
    constructor(
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository,
        @Inject("IAppointmentRepository")
        private readonly appointmentRepository: IAppointmentRepository
    ) { }

    async execute(petId: string, clinicId: string): Promise<void> {
        const appointmentsPet = await this.appointmentRepository.findByPetId(petId);
        if (!UpdateClinicPolicy.canUpdateClinicByAppointments(appointmentsPet)) throw new ClinicChangeNotAllowedByAppointmentException();
        await this.petRepository.updateClinic(petId, clinicId);
    }
}