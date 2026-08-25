import { AdressNotFoundException } from "@/common/domain/exceptions";
import { NameClinicNotFoundException, EmailOrPhoneNotFoundException } from "../exceptions";

export class VeterinaryClinicEntity {
    private readonly id: string;
    private readonly name: string;
    private readonly address: string;
    private readonly phone: string | null;
    private readonly email: string | null;
    private readonly createdAt?: Date;
    private readonly updatedAt?: Date;

    private constructor(properties: {
        id: string;
        name: string;
        address: string;
        phone?: string | null;
        email?: string | null;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        if (!properties.id) {
            throw new Error("Clinic ID is required");
        }
        if (!properties.name) {
            throw new NameClinicNotFoundException();
        }
        if (!properties.address) {
            throw new AdressNotFoundException();
        }
        if (!properties.phone && !properties.email) {
            throw new EmailOrPhoneNotFoundException();
        }

        this.id = properties.id;
        this.name = properties.name;
        this.address = properties.address;
        this.phone = properties.phone ?? null;
        this.email = properties.email ?? null;
        this.createdAt = properties.createdAt;
        this.updatedAt = properties.updatedAt;
    }

    public static create(properties: {
        id: string;
        name: string;
        address: string;
        phone?: string | null;
        email?: string | null;
        createdAt?: Date;
        updatedAt?: Date;
    }): VeterinaryClinicEntity {
        return new VeterinaryClinicEntity({
            id: properties.id,
            name: properties.name,
            address: properties.address,
            phone: properties.phone,
            email: properties.email,
            createdAt: properties.createdAt ?? new Date(),
            updatedAt: properties.updatedAt ?? new Date(),
        });
    }

    // Getters
    public getId(): string { return this.id; }
    public getName(): string { return this.name; }
    public getAddress(): string { return this.address; }
    public getPhone(): string | null { return this.phone; }
    public getEmail(): string | null { return this.email; }
    public getCreatedAt(): Date | undefined { return this.createdAt; }
    public getUpdatedAt(): Date | undefined { return this.updatedAt; }
}
