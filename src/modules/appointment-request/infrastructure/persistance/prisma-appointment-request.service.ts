import { Injectable } from "@nestjs/common";
import { CriteriaAppointmentRequest, IAppointmentRequestRepository } from "../../domain/ports";
import { CreateAppointmentRequestDto, ResponseAppointmentRequestDto } from "../../domain/dtos";
import { RequestStatus } from "../../domain/types";
import { PrismaService } from "@/common/infrastructure/db";
import { AppointmentRequestEntity } from "../../domain/entities";
import { OwnerNotFoundException } from "@owner/domain/exceptions";
import { UserNotExistException } from "@/common/domain/exceptions";

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

    private mapToResponseDto(request: any): ResponseAppointmentRequestDto {
        return {
            id: request.id,
            userId: request.owner.userId,
            petId: request.petId,
            requestedDate: request.requestedDate,
            reason: request.reason,
            notes: request.notes,
            status: request.status,
            userVeterinarianId: request.veterinarianId,
            clinicId: request.clinicId,
            rejectionReason: request.rejectionReason,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            pet: {
                id: request.pet.id,
                name: request.pet.name,
                mainImage: request.pet.mainImage,
            },
            owner: {
                id: request.owner.id,
                user: {
                    name: request.owner.user.name,
                },
            },
            veterinarian: {
                id: request.reviewedBy?.id,
                user: {
                    name: request.reviewedBy?.user?.name,
                },
            },
            clinic: {
                id: request.clinic.id,
                name: request.clinic.name,
            },
        };
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
                veterinarianId: data.veterinarianId
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

    async findByUserId(userId: string, query?: CriteriaAppointmentRequest): Promise<ResponseAppointmentRequestDto[]> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const { status, page, limit, sortField, sortOrder } = query || {};

        if (!user) {
            throw new UserNotExistException();
        }

        const veterinarian = await this.prisma.veterinarian.findUnique({ where: { userId } });

        const requests = await this.prisma.appointmentRequest.findMany({
            where: {
                OR: [
                    { owner: { userId } },
                    { clinic: { veterinarians: { some: { id: veterinarian?.id } } } },
                    { OR: [{ veterinarian: { userId } }, { reviewedById: veterinarian?.id }] }
                ],
                ...(status && { status: { in: status } })
            },
            include: {
                owner: {
                    select: {
                        userId: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                pet: {
                    select: {
                        id: true,
                        name: true,
                        mainImage: true
                    }
                },
                reviewedBy: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                clinic: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { [sortField || 'createdAt']: sortOrder || 'desc' },
            skip: page ? (page - 1) * (limit || 10) : undefined,
            take: limit || 10,
        });

        return requests.map(r => this.mapToResponseDto(r));
    }
}