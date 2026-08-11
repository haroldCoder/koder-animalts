import { AppointmentEntity } from "../entities/appointment.entity";
import { AppointmentStatus } from "../enums/appointment-status.enum";
import type { AppointmentWithRelations } from "../../infrastructure/persistence/prisma-appointment.service";
import { CreateAppointmentDto } from "../dto/create-appointment.dto";

export interface IAppointmentRepository {
    create(appointment: CreateAppointmentDto): Promise<AppointmentEntity>;
    findById(id: string): Promise<AppointmentEntity | null>;
    findByUserId(userId: string): Promise<AppointmentWithRelations[]>;
    findByPetId(petId: string): Promise<AppointmentEntity[]>;
    updateStatus(id: string, status: AppointmentStatus): Promise<AppointmentEntity>;
}
