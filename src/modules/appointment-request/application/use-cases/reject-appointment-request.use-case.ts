import { Inject, Injectable } from "@nestjs/common";
import type { IAppointmentRequestRepository } from "../../domain/ports";
import { ReviewRequestPolicy } from "../../domain/policies";
import {
    AppointmentRequestNotFoundException,
    CannotRejectAppointmentRequestException,
} from "../../domain/exceptions";

@Injectable()
export class RejectAppointmentRequestUseCase {
    constructor(
        @Inject("IAppointmentRequestRepository")
        private repo: IAppointmentRequestRepository) { }

    async execute(requestId: string, vetId: string, vetClinicId: string, reason: string) {
        const request = await this.repo.findById(requestId);
        if (!request) throw new AppointmentRequestNotFoundException();
        if (!ReviewRequestPolicy.canApprove(request, vetClinicId)) {
            throw new CannotRejectAppointmentRequestException();
        }
        return this.repo.updateStatus(requestId, 'REJECTED', {
            rejectionReason: reason,
            reviewedById: vetId,
        });
    }
}