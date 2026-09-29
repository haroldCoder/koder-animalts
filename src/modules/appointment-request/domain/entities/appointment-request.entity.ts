import { RequestStatus } from "../types";

export class AppointmentRequestEntity {
    constructor(
        public readonly id: string,
        public readonly ownerId: string,
        public readonly petId: string,
        public readonly clinicId: string,
        public readonly reason: string,
        public readonly requestedDate: Date,
        public status: RequestStatus,
        public veterinarianId?: string,
        public reviewedById?: string,
        public rejectionReason?: string,
    ) { }

    isPending(): boolean {
        return this.status === 'PENDING';
    }
}