export class VeterinarianModel {
    id: string;
    specialty?: string;
    phone: string;
    userId: string;
    clinicId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class CreateVeterinarianModel {
    specialty?: string;
    phone: string;
    userId: string;
    clinicId: string;
}

export class VeterinarianWithDetailsModel extends VeterinarianModel {
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
