import { AppointmentEntity } from "../entities/appointment.entity";
import { AppointmentStatus } from "../enums/appointment-status.enum";
import { CreateAppointmentDto } from "../dto/create-appointment.dto";
import { AppointmentRelationUserDto } from "../dto/appointment-relation-user.dto";
import { FindCriteriaQueries } from "@/common/interfaces";

export interface FindAppointmentsCriteria extends FindCriteriaQueries {
    startDate?: Date;
    endDate?: Date;
    status?: AppointmentStatus[];
}

export interface IAppointmentRepository {
    create(appointment: CreateAppointmentDto): Promise<AppointmentEntity>;
    findById(id: string): Promise<AppointmentEntity | null>;
    findByUserId(userId: string, criteria?: FindAppointmentsCriteria): Promise<AppointmentRelationUserDto[]>;
    findByPetId(petId: string): Promise<AppointmentEntity[]>;
    updateStatus(id: string, status: AppointmentStatus): Promise<AppointmentEntity>;
}
