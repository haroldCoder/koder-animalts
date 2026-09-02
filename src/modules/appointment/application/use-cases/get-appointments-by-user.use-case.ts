import { Inject, Injectable } from "@nestjs/common";
import type { FindAppointmentsCriteria, IAppointmentRepository } from "../../domain/ports/appointment.repository";
import { AppointmentRelationUserDto } from "@appointment/domain/dto/appointment-relation-user.dto";

@Injectable()
export class GetAppointmentsByUserUseCase {
    constructor(
        @Inject("IAppointmentRepository")
        private readonly appointmentRepository: IAppointmentRepository
    ) { }

    async execute(userId: string, criteria?: FindAppointmentsCriteria): Promise<AppointmentRelationUserDto[]> {
        return this.appointmentRepository.findByUserId(userId, criteria);
    }
}
