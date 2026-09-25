import { Injectable } from "@nestjs/common";
import type { IAppointmentRequestRepository } from "../../domain/ports";
import { ReviewRequestPolicy } from "../../domain/policies";
import { NotFoundException } from "@nestjs/common";
import { ForbiddenException } from "@nestjs/common";
import type { IAppointmentRepository } from "@appointment/domain/ports/appointment.repository";
import type { IVeterinaryClinicRepository } from "@veterinary-clinics/domain/ports";
import { VeterinaryClinicNotFoundException } from "@veterinary-clinics/domain/exceptions";
import { AppointmentRequestNotFoundException, CannotApproveAppointmentRequestException } from "../../domain/exceptions";
import { TransactionManager } from "@/common/domain/ports";

@Injectable()
export class ApproveAppointmentRequestUseCase {
    constructor(
        private requestRepo: IAppointmentRequestRepository,
        private appointmentRepo: IAppointmentRepository,
        private clinicRepo: IVeterinaryClinicRepository,
        private tx: TransactionManager
    ) { }

    async execute(requestId: string, vetClinicId: string, notes?: string): Promise<string> {
        const vetClinic = await this.clinicRepo.findById(vetClinicId);
        if (!vetClinic) throw new VeterinaryClinicNotFoundException();

        const request = await this.requestRepo.findById(requestId);
        if (!request) throw new AppointmentRequestNotFoundException();

        if (!ReviewRequestPolicy.canApprove(request, vetClinicId)) {
            throw new CannotApproveAppointmentRequestException();
        }

        return this.tx.run(async () => {
            const { getId } = await this.appointmentRepo.create({
                date: request.requestedDate,
                reason: request.reason,
                notes: notes,
                petId: request.petId,
                userId: request.ownerId,
            });

            await this.requestRepo.updateStatus(requestId, 'APPROVED');

            const id = getId();

            return id;
        });
    }
}