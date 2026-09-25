export interface CreateAppointmentRequestDto {
    userId: string;
    petId: string;
    clinicId: string;
    reason: string;
    requestedDate: Date;
}