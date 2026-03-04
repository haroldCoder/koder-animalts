import { PartialType } from "@nestjs/mapped-types";

export class VeterinaryClinicModel {
    id: string;
    name: string;
    address: string;
    phone: string | null;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export class CreateVeterinaryClinicModel {
    name: string;
    address: string;
    phone?: string | null;
    email?: string | null;
}

export class UpdateVeterinaryClinicModel extends PartialType(CreateVeterinaryClinicModel) { }
