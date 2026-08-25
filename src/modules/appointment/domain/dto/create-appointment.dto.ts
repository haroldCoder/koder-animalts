export interface CreateAppointmentDto {
    date: Date;
    reason: string;
    notes?: string;
    petId: string;
    userId: string;
}