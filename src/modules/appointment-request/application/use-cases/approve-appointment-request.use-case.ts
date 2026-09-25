import { Inject, Injectable } from "@nestjs/common";
import type { IAppointmentRequestRepository } from "../../domain/ports";
import { ReviewRequestPolicy } from "../../domain/policies";
import type { IAppointmentRepository } from "@appointment/domain/ports/appointment.repository";
import type { IVeterinaryClinicRepository } from "@veterinary-clinics/domain/ports";
import { VeterinaryClinicNotFoundException } from "@veterinary-clinics/domain/exceptions";
import { AppointmentRequestNotFoundException, CannotApproveAppointmentRequestException } from "../../domain/exceptions";
import { TransactionManager } from "@/common/domain/ports";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { VeterinarianIdNotExistException } from "@/common/domain/exceptions";

@Injectable()
export class ApproveAppointmentRequestUseCase {
    constructor(
        @Inject("IAppointmentRequestRepository")
        private requestRepo: IAppointmentRequestRepository,
        @Inject("IAppointmentRepository")
        private appointmentRepo: IAppointmentRepository,
        @Inject("IVeterinaryClinicRepository")
        private clinicRepo: IVeterinaryClinicRepository,
        @Inject("IVeterinarianRepository")
        private vetRepo: IVeterinarianRepository,
        private tx: TransactionManager
    ) { }

    async execute(requestId: string, userVetId: string, vetClinicId: string, notes?: string): Promise<string> {
        const vetClinic = await this.clinicRepo.findById(vetClinicId);
        if (!vetClinic) throw new VeterinaryClinicNotFoundException();

        const veterinarian = await this.vetRepo.findByUserId(userVetId);
        if (!veterinarian) throw new VeterinarianIdNotExistException();

        const request = await this.requestRepo.findById(requestId);
        if (!request) throw new AppointmentRequestNotFoundException();

        if (!ReviewRequestPolicy.canApprove(request, vetClinicId)) {
            throw new CannotApproveAppointmentRequestException();
        }

        return this.tx.run(async () => {
            const appointment = await this.appointmentRepo.create({
                date: request.requestedDate,
                reason: request.reason,
                notes: notes,
                petId: request.petId,
                userId: userVetId,
            });

            const veterinarianId = veterinarian.getId();

            await this.requestRepo.updateStatus(requestId, 'APPROVED', { reviewedById: veterinarianId });

            const id = appointment.getId();

            return id;
        });
    }
}