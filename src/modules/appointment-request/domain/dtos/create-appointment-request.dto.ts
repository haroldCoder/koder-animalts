export interface CreateAppointmentRequestDto {
    ownerId: string;
    petId: string;
    clinicId: string;
    reason: string;
    requestedDate: Date;
}