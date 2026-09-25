import { RequestStatus } from "../types";
import { CreateAppointmentRequestDto } from "../dtos";
import { AppointmentRequestEntity } from "../entities";
import { FindCriteriaQueries } from "@/common/interfaces";

export interface CriteriaAppointmentRequest extends FindCriteriaQueries {
  status?: RequestStatus[];
}

export interface IAppointmentRequestRepository {
  create(data: CreateAppointmentRequestDto): Promise<string>;
  findById(id: string): Promise<AppointmentRequestEntity | null>;
  findByClinic(clinicId: string, status?: RequestStatus): Promise<AppointmentRequestEntity[]>;
  findByOwner(ownerId: string): Promise<AppointmentRequestEntity[]>;
  findByUserId(userId: string, query?: CriteriaAppointmentRequest): Promise<AppointmentRequestEntity[]>;
  updateStatus(id: string, status: RequestStatus, extra?: Partial<AppointmentRequestEntity>): Promise<AppointmentRequestEntity>;
}