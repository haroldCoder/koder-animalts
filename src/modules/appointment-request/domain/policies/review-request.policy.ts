import { AppointmentRequestEntity } from "../entities";

export class ReviewRequestPolicy {
    static canApprove(request: AppointmentRequestEntity, vetClinicId: string): boolean {
        // solo puede resolverla un vet que pertenezca a la clínica destino,
        // y solo si sigue pendiente
        return request.isPending() && request.clinicId === vetClinicId;
    }

    static canCancel(request: AppointmentRequestEntity, ownerId: string): boolean {
        return request.isPending() && request.ownerId === ownerId;
    }
}