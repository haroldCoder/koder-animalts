import { Inject, Injectable } from "@nestjs/common";
import type { IAppointmentRepository } from "../../domain/ports/appointment.repository";
import type { AppointmentWithRelations } from "../../infrastructure/persistence/prisma-appointment.service";

@Injectable()
export class GetAppointmentsByUserUseCase {
    constructor(
        @Inject("IAppointmentRepository")
        private readonly appointmentRepository: IAppointmentRepository
    ) { }

    async execute(userId: string): Promise<AppointmentWithRelations[]> {
        return this.appointmentRepository.findByUserId(userId);
    }
}
