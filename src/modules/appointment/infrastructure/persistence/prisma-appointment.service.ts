import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import type { FindAppointmentsCriteria, IAppointmentRepository } from "../../domain/ports/appointment.repository";
import { AppointmentEntity } from "../../domain/entities";
import { AppointmentStatus } from "../../domain/enums/appointment-status.enum";
import { Appointment, Prisma } from "@prisma/client";
import { CreateAppointmentDto } from "../../domain/dto/create-appointment.dto";
import { AppointmentRelationUserDto } from "@appointment/domain/dto/appointment-relation-user.dto";
import { normalizeEndDate, normalizeStartDAte } from "@/common/utils";

export type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
    include: {
        pet: { select: { id: true; name: true, mainImage: true } },
        veterinarian: {
            include: {
                user: { select: { name: true } };
                clinic: { select: { name: true } };
            };
        };
    };
}>;

@Injectable()
export class PrismaAppointmentService implements IAppointmentRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(appointment: CreateAppointmentDto): Promise<AppointmentEntity> {
        const veterinarian = await this.prisma.veterinarian.findFirst({
            where: {
                userId: appointment.userId
            },
            select: {
                id: true
            }
        });

        if (!veterinarian?.id) {
            throw new BadRequestException("Not found veterinarian for this user");
        }

        const createdAppointment = await this.prisma.appointment.create({
            data: {
                date: appointment.date,
                reason: appointment.reason,
                notes: appointment.notes,
                status: AppointmentStatus.SCHEDULED,
                petId: appointment.petId,
                veterinarianId: veterinarian?.id,
            }
        });
        return this.mapToEntity(createdAppointment);
    }

    async findById(id: string): Promise<AppointmentEntity | null> {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id }
        });
        if (!appointment) return null;
        return this.mapToEntity(appointment);
    }

    async findByUserId(userId: string, criteria?: FindAppointmentsCriteria): Promise<AppointmentRelationUserDto[]> {
        const { startDate, endDate } = criteria || {};

        const normalizedStartDate = startDate ? normalizeStartDAte(startDate) : undefined;
        const normalizedEndDate = endDate ? normalizeEndDate(endDate) : undefined;

        const appointments = await this.prisma.appointment.findMany({
            where: {
                OR: [
                    { pet: { owner: { userId } } },
                    { veterinarian: { userId } }
                ],
                ...(normalizedStartDate && { date: { gte: normalizedStartDate } }),
                ...(normalizedEndDate && { date: { lte: normalizedEndDate } }),

            },
            include: {
                pet: { select: { id: true, name: true, mainImage: true, owner: { select: { user: { select: { name: true } } } } } },

                veterinarian: {
                    include: {
                        user: { select: { name: true } },
                        clinic: { select: { name: true } },
                    },
                },
            },
        });

        return appointments.map(a => ({
            id: a.id,
            date: a.date,
            reason: a.reason,
            status: a.status as AppointmentStatus,
            notes: a.notes ?? "",
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
            petId: a.petId,
            veterinarianId: a.veterinarianId,
            pet: {
                id: a.pet.id,
                name: a.pet.name,
                mainImage: a.pet.mainImage,
                owner: {
                    user: {
                        name: a.pet.owner.user.name ?? ""
                    }
                }
            },
            veterinarian: {
                user: {
                    name: a.veterinarian.user.name ?? ""
                },
                clinic: {
                    name: a.veterinarian.clinic.name
                }
            }
        }));
    }

    async findByPetId(petId: string): Promise<AppointmentEntity[]> {
        const appointments = await this.prisma.appointment.findMany({
            where: { petId }
        });
        return appointments.map(a => this.mapToEntity(a));
    }

    async updateStatus(id: string, status: AppointmentStatus): Promise<AppointmentEntity> {
        const updatedAppointment = await this.prisma.appointment.update({
            where: { id },
            data: { status }
        });
        return this.mapToEntity(updatedAppointment);
    }

    private mapToEntity(appointment: Appointment): AppointmentEntity {
        return AppointmentEntity.create({
            id: appointment.id,
            date: appointment.date,
            reason: appointment.reason,
            status: appointment.status as AppointmentStatus,
            notes: appointment.notes ?? undefined,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
            petId: appointment.petId,
            veterinarianId: appointment.veterinarianId,
        });
    }
}
