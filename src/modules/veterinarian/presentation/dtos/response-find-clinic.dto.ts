export interface ResponseFindClinicDto {
    user: {
        id: string;
        name: string | null;
    }
    clinic: {
        id: string;
        name: string | null;
    }
    specialty: string | null;
    phone: string | null;
}