export interface VeterinarianEntity {
    id: string;
    specialty: string;
    phone: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    clinic: {
        id: string;
        name: string;
    };
}