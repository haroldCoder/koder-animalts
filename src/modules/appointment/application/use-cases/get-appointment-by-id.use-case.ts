import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AppointmentEntity } from "../../domain/entities";
import type { IAppointmentRepository } from "../../domain/ports/appointment.repository";

@Injectable()
export class GetAppointmentByIdUseCase {
    constructor(
        @Inject("IAppointmentRepository")
        private readonly appointmentRepository: IAppointmentRepository
    ) { }

    async execute(id: string): Promise<AppointmentEntity> {
        const appointment = await this.appointmentRepository.findById(id);
        if (!appointment) {
            throw new NotFoundException(`Appointment with ID ${id} not found`);
        }
        return appointment;
    }
}
