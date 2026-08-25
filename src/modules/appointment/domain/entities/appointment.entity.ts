import { AppointmentStatus } from "../enums/appointment-status.enum";
import {
    AppointmentDateNotFoundException,
    AppointmentReasonNotFoundException,
    AppointmentStatusNotFoundException,
    AppointmentIdNotFoundException,
    EarlyAppointmentStatusUpdateException
} from "../exceptions";
import { PetIdNotFoundException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";

export class AppointmentEntity {
    private readonly id: string;
    private readonly date: Date;
    private readonly reason: string;
    private status: AppointmentStatus;
    private readonly notes: string;
    private readonly createdAt: Date;
    private readonly updatedAt: Date;
    private readonly petId: string;
    private readonly veterinarianId: string;

    private constructor(properties: {
        id: string;
        date: Date;
        reason: string;
        status: AppointmentStatus;
        notes?: string;
        createdAt: Date;
        updatedAt: Date;
        petId: string;
        veterinarianId: string;
    }) {
        if (!properties.id) {
            throw new AppointmentIdNotFoundException();
        }
        if (!properties.date) {
            throw new AppointmentDateNotFoundException();
        }
        if (!properties.reason) {
            throw new AppointmentReasonNotFoundException();
        }
        if (!properties.status) {
            throw new AppointmentStatusNotFoundException();
        }
        if (!properties.petId) {
            throw new PetIdNotFoundException();
        }
        if (!properties.veterinarianId) {
            throw new VeterinarianIdNotFoundException();
        }

        this.id = properties.id;
        this.date = properties.date;
        this.reason = properties.reason;
        this.status = properties.status;
        this.notes = properties.notes ?? "";
        this.createdAt = properties.createdAt;
        this.updatedAt = properties.updatedAt;
        this.petId = properties.petId;
        this.veterinarianId = properties.veterinarianId;
    }

    public static create(properties: {
        id: string;
        date: Date;
        reason: string;
        status?: AppointmentStatus;
        notes?: string;
        createdAt?: Date;
        updatedAt?: Date;
        petId: string;
        veterinarianId: string;
    }): AppointmentEntity {
        return new AppointmentEntity({
            id: properties.id,
            date: properties.date,
            reason: properties.reason,
            status: properties.status ?? AppointmentStatus.SCHEDULED,
            notes: properties.notes,
            createdAt: properties.createdAt ?? new Date(),
            updatedAt: properties.updatedAt ?? new Date(),
            petId: properties.petId,
            veterinarianId: properties.veterinarianId,
        });
    }

    // Business Logic Methods
    public updateStatus(newStatus: AppointmentStatus): void {
        const currentDate = new Date();
        if (currentDate < this.date && newStatus == AppointmentStatus.COMPLETED) {
            throw new EarlyAppointmentStatusUpdateException();
        }
        this.status = newStatus;
    }

    // Getters
    public getId(): string { return this.id; }
    public getDate(): Date { return this.date; }
    public getReason(): string { return this.reason; }
    public getStatus(): AppointmentStatus { return this.status; }
    public getNotes(): string { return this.notes; }
    public getCreatedAt(): Date { return this.createdAt; }
    public getUpdatedAt(): Date { return this.updatedAt; }
    public getPetId(): string { return this.petId; }
    public getVeterinarianId(): string { return this.veterinarianId; }
}
