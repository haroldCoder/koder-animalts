import { AdressNotFoundException, PhoneNotFoundException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { OwnerAlreadyExistException } from "../exceptions";

export class OwnerEntity {
    private readonly id: string;
    private address: string;
    private phone: string;
    private readonly userId: string;
    private readonly createdAt?: Date;
    private readonly updatedAt?: Date;

    private constructor(properties: {
        id: string;
        address: string;
        phone: string;
        userId: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        if (!properties.id) {
            throw new UserIdNotFoundException();
        }
        if (!properties.address) {
            throw new AdressNotFoundException();
        }
        if (!properties.phone) {
            throw new PhoneNotFoundException();
        }
        if (!properties.userId) {
            throw new UserIdNotFoundException();
        }

        this.id = properties.id;
        this.address = properties.address;
        this.phone = properties.phone;
        this.userId = properties.userId;
        this.createdAt = properties.createdAt;
        this.updatedAt = properties.updatedAt;
    }

    public static create(properties: {
        id: string;
        address: string;
        phone: string;
        userId: string;
        createdAt?: Date;
        updatedAt?: Date;
    }): OwnerEntity {
        return new OwnerEntity({
            id: properties.id,
            address: properties.address,
            phone: properties.phone,
            userId: properties.userId,
            createdAt: properties.createdAt ?? new Date(),
            updatedAt: properties.updatedAt ?? new Date(),
        });
    }

    public static ensureDoesNotExist(existing: OwnerEntity | null): void {
        if (existing !== null) {
            throw new OwnerAlreadyExistException();
        }
    }

    // Getters
    public getId(): string { return this.id; }
    public getAddress(): string { return this.address; }
    public getPhone(): string { return this.phone; }
    public getUserId(): string { return this.userId; }
    public getCreatedAt(): Date | undefined { return this.createdAt; }
    public getUpdatedAt(): Date | undefined { return this.updatedAt; }

    // Mutations
    public updateDetails(properties: {
        address?: string;
        phone?: string;
    }): void {
        if (properties.address !== undefined) {
            if (!properties.address) throw new AdressNotFoundException();
            this.address = properties.address;
        }
        if (properties.phone !== undefined) {
            if (!properties.phone) throw new PhoneNotFoundException();
            this.phone = properties.phone;
        }
    }
}
