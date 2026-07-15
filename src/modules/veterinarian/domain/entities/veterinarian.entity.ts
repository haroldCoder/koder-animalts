import { PhoneNotFoundException, UserIdNotFoundException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";
import { ClinicIdNotFoundException, VeterinarianAlreadyExistsException } from "../exceptions";

export class VeterinarianEntity {
    private readonly id: string;
    private readonly phone: string;
    private readonly specialty: string | null;
    private readonly userId: string;
    private readonly clinicId: string;
    private readonly createdAt?: Date;
    private readonly updatedAt?: Date;

    private readonly user?: {
        id: string;
        name: string;
        email: string;
    };
    private readonly clinic?: {
        id: string;
        name: string;
    };

    private constructor(properties: {
        id: string;
        phone: string;
        specialty?: string | null;
        userId: string;
        clinicId: string;
        createdAt?: Date;
        updatedAt?: Date;
        user?: {
            id: string;
            name: string;
            email: string;
        };
        clinic?: {
            id: string;
            name: string;
        };
    }) {
        if (!properties.id) {
            throw new VeterinarianIdNotFoundException();
        }
        if (!properties.phone) {
            throw new PhoneNotFoundException();
        }
        if (!properties.userId) {
            throw new UserIdNotFoundException();
        }
        if (!properties.clinicId) {
            throw new ClinicIdNotFoundException();
        }

        this.id = properties.id;
        this.phone = properties.phone;
        this.specialty = properties.specialty ?? null;
        this.userId = properties.userId;
        this.clinicId = properties.clinicId;
        this.createdAt = properties.createdAt;
        this.updatedAt = properties.updatedAt;
        this.user = properties.user;
        this.clinic = properties.clinic;
    }

    public static create(properties: {
        id: string;
        phone: string;
        specialty?: string | null;
        userId: string;
        clinicId: string;
        createdAt?: Date;
        updatedAt?: Date;
        user?: {
            id: string;
            name: string;
            email: string;
        };
        clinic?: {
            id: string;
            name: string;
        };
    }): VeterinarianEntity {
        return new VeterinarianEntity({
            id: properties.id,
            phone: properties.phone,
            specialty: properties.specialty ?? null,
            userId: properties.userId,
            clinicId: properties.clinicId,
            createdAt: properties.createdAt ?? new Date(),
            updatedAt: properties.updatedAt ?? new Date(),
            user: properties.user,
            clinic: properties.clinic,
        });
    }

    public static ensureDoesNotExist(existing: VeterinarianEntity | null): void {
        if (existing !== null) {
            throw new VeterinarianAlreadyExistsException();
        }
    }

    // Getters
    public getId(): string { return this.id; }
    public getPhone(): string { return this.phone; }
    public getSpecialty(): string | null { return this.specialty; }
    public getUserId(): string { return this.userId; }
    public getClinicId(): string { return this.clinicId; }
    public getCreatedAt(): Date | undefined { return this.createdAt; }
    public getUpdatedAt(): Date | undefined { return this.updatedAt; }
    public getUser() { return this.user; }
    public getClinic() { return this.clinic; }
}