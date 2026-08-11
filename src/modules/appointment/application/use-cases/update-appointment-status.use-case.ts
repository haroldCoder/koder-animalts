import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AppointmentEntity } from "../../domain/entities";
import type { IAppointmentRepository } from "../../domain/ports/appointment.repository";
import { UpdateAppointmentStatusDto } from "../../presentation/dtos";

@Injectable()
export class UpdateAppointmentStatusUseCase {
    constructor(
        @Inject("IAppointmentRepository")
        private readonly appointmentRepository: IAppointmentRepository
    ) { }

    async execute(id: string, data: UpdateAppointmentStatusDto): Promise<AppointmentEntity> {
        const appointment = await this.appointmentRepository.findById(id);
        if (!appointment) {
            throw new NotFoundException(`Appointment with ID ${id} not found`);
        }

        // Trigger business logic validation in the entity
        appointment.updateStatus(data.status);

        return this.appointmentRepository.updateStatus(id, data.status);
    }
}
