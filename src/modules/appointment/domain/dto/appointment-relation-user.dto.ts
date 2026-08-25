import { AppointmentStatus } from "../enums/appointment-status.enum";

export interface AppointmentRelationUserDto {
    id: string;
    date: Date;
    reason: string;
    status: AppointmentStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    petId: string;
    veterinarianId: string;
    pet: {
        id: string,
        name: string,
        mainImage: string,
        owner: {
            user: {
                name: string
            }
        }
    },
    veterinarian: {
        user: {
            name: string
        },
        clinic: {
            name: string
        }
    }
}
