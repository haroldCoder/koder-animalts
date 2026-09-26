export interface ResponseAppointmentRequestDto {
    id: string;
    userId: string;
    petId: string;
    requestedDate: string;
    reason: string;
    notes?: string;
    status: string;
    userVeterinarianId?: string;
    clinicId?: string;
    rejectionReason?: string;
    createdAt?: string;
    updatedAt?: string;
    pet?: {
        id: string;
        name: string;
        mainImage?: string;
    };
    owner?: {
        id?: string;
        user?: {
            name?: string;
        };
    };
    veterinarian?: {
        id?: string;
        user?: {
            name?: string;
        }
    };
    clinic?: {
        id?: string;
        name?: string;
    };
}
