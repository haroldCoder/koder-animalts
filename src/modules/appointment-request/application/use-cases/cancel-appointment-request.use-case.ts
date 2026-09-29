import { Inject, Injectable } from "@nestjs/common";
import type { IAppointmentRequestRepository } from "../../domain/ports";
import type { IOwnerRepository } from "@owner/domain/ports";
import { ReviewRequestPolicy } from "../../domain/policies";
import {
    AppointmentRequestNotFoundException,
    CannotCancelAppointmentRequestException,
} from "../../domain/exceptions";
import { OwnerNotFoundException } from "@owner/domain/exceptions";
import { UserIdNotFoundException } from "@/common/domain/exceptions";
import { AppointmentRequestEntity } from "../../domain/entities";

@Injectable()
export class CancelAppointmentRequestUseCase {
    constructor(
        @Inject("IAppointmentRequestRepository")
        private readonly requestRepo: IAppointmentRequestRepository,
        @Inject("IOwnerRepository")
        private readonly ownerRepo: IOwnerRepository,
    ) { }

    async execute(requestId: string, userId: string): Promise<AppointmentRequestEntity> {
        if (!userId) {
            throw new UserIdNotFoundException();
        }

        const request = await this.requestRepo.findById(requestId);
        if (!request) {
            throw new AppointmentRequestNotFoundException(requestId);
        }

        let owner = await this.ownerRepo.findByUserId(userId);
        if (!owner && this.ownerRepo.findById) {
            owner = await this.ownerRepo.findById(userId);
        }

        if (!owner) {
            throw new OwnerNotFoundException(userId);
        }

        if (!ReviewRequestPolicy.canCancel(request, owner.getId())) {
            throw new CannotCancelAppointmentRequestException();
        }

        return this.requestRepo.updateStatus(requestId, "CANCELLED");
    }
}
