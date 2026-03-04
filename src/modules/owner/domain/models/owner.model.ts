export class OwnerModel {
    id: string;
    address: string;
    phone: string;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class CreateOwnerModel {
    address: string;
    phone: string;
    userId: string;
}
