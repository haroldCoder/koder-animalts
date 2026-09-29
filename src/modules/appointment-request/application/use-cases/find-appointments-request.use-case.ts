import { Injectable } from "@nestjs/common";
import type { IAppointmentRequestRepository } from "../../domain/ports";
import { CriteriaAppointmentRequest } from "../../domain/ports";
import { Inject } from "@nestjs/common";

@Injectable()
export class FindAppointmentsRequestUseCase {
    constructor(
        @Inject('IAppointmentRequestRepository')
        private readonly repository: IAppointmentRequestRepository
    ) { }

    async execute(userId: string, query?: CriteriaAppointmentRequest) {
        return this.repository.findByUserId(userId, query);
    }
}