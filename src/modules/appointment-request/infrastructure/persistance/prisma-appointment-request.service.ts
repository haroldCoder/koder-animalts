import { Injectable } from "@nestjs/common";
import { IAppointmentRequestRepository } from "../../domain/ports";
import { CreateAppointmentRequestDto } from "../../domain/dtos";
import { RequestStatus } from "../../domain/types";
import { PrismaService } from "@/common/infrastructure/db";
import { AppointmentRequestEntity } from "../../domain/entities";
import { OwnerNotFoundException } from "@owner/domain/exceptions";

@Injectable()
export class PrismaAppointmentRequestRepository implements IAppointmentRequestRepository {
    constructor(private prisma: PrismaService) { }

    private mapToEntity(request: any): AppointmentRequestEntity {
        return new AppointmentRequestEntity(
            request.id,
            request.ownerId,
            request.petId,
            request.clinicId,
            request.reason,
            request.requestedDate,
            request.status,
            request.veterinarianId || undefined,
            request.reviewedById || undefined,
            request.rejectionReason || undefined
        );
    }

    async create(data: CreateAppointmentRequestDto) {
        const { userId } = data;

        const owner = await this.prisma.owner.findUnique({
            where: { userId: userId },
        });

        if (!owner) {
            throw new OwnerNotFoundException(userId);
        }

        const { id } = await this.prisma.appointmentRequest.create({
            data: {
                ownerId: owner.id,
                petId: data.petId,
                clinicId: data.clinicId,
                reason: data.reason,
                requestedDate: data.requestedDate,
            },
        });

        return id;
    }

    async findByClinic(clinicId: string, status?: RequestStatus) {
        const requests = await this.prisma.appointmentRequest.findMany({
            where: { clinicId, ...(status && { status }) },
            include: { owner: true, pet: true },
            orderBy: { createdAt: 'desc' },
        });

        return requests.map(r => this.mapToEntity(r));
    }

    async findByOwner(ownerId: string) {
        const requests = await this.prisma.appointmentRequest.findMany({
            where: { ownerId },
            include: { owner: true, pet: true },
            orderBy: { createdAt: 'desc' },
        });

        return requests.map(r => this.mapToEntity(r));
    }

    async updateStatus(id: string, status: RequestStatus, extra?: Partial<AppointmentRequestEntity>) {
        const request = await this.prisma.appointmentRequest.update({
            where: { id },
            data: {
                status,
                ...(extra?.rejectionReason && { rejectionReason: extra.rejectionReason }),
                ...(extra?.veterinarianId && { veterinarianId: extra.veterinarianId }),
                ...(extra?.reviewedById && { reviewedById: extra.reviewedById }),
            },
            include: { owner: true, pet: true },
        });

        return this.mapToEntity(request);
    }

    async findById(id: string) {
        const request = await this.prisma.appointmentRequest.findUnique({
            where: { id },
            include: { owner: true, pet: true },
        });

        if (!request) return null;

        return new AppointmentRequestEntity(request.id, request.ownerId, request.petId, request.clinicId, request.reason, request.requestedDate, request.status, request.veterinarianId || undefined, request.reviewedById || undefined, request.rejectionReason || undefined);
    }
}