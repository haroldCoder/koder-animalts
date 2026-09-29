import { Inject, Injectable } from "@nestjs/common";
import type { IAppointmentRequestRepository } from "../../domain/ports";
import { ReviewRequestPolicy } from "../../domain/policies";
import {
    AppointmentRequestNotFoundException,
    CannotRejectAppointmentRequestException,
} from "../../domain/exceptions";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { VeterinaryClinicNotFoundException } from "@veterinary-clinics/domain/exceptions";
import { VeterinarianIdNotExistException } from "@/common/domain/exceptions";

@Injectable()
export class RejectAppointmentRequestUseCase {
    constructor(
        @Inject("IAppointmentRequestRepository")
        private repo: IAppointmentRequestRepository,
        @Inject("IVeterinarianRepository")
        private vetRepo: IVeterinarianRepository
    ) { }

    async execute(requestId: string, userVetId: string, reason: string) {
        const request = await this.repo.findById(requestId);
        if (!request) throw new AppointmentRequestNotFoundException();

        const vet = await this.vetRepo.findByUserId(userVetId);
        if (!vet) throw new VeterinarianIdNotExistException();
        const id = vet.getId();

        const clinic = await this.vetRepo.findClinicByVeterinarianId(id);
        if (!clinic) throw new VeterinaryClinicNotFoundException();

        if (!ReviewRequestPolicy.canApprove(request, clinic.id)) {
            throw new CannotRejectAppointmentRequestException();
        }


        return this.repo.updateStatus(requestId, 'REJECTED', {
            rejectionReason: reason,
            reviewedById: id,
        });
    }
}