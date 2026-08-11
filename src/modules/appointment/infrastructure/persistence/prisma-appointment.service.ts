import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import type { IAppointmentRepository } from "../../domain/ports/appointment.repository";
import { AppointmentEntity } from "../../domain/entities";
import { AppointmentStatus } from "../../domain/enums/appointment-status.enum";
import { Appointment, Prisma } from "@prisma/client";
import { CreateAppointmentDto } from "../../domain/dto/create-appointment.dto";

export type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
    include: {
        pet: { select: { id: true; name: true } };
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

    async findByUserId(userId: string): Promise<AppointmentWithRelations[]> {
        return this.prisma.appointment.findMany({
            where: {
                OR: [
                    { pet: { owner: { userId } } },
                    { veterinarian: { userId } }
                ]
            },
            include: {
                pet: { select: { id: true, name: true } },
                veterinarian: {
                    include: {
                        user: { select: { name: true } },
                        clinic: { select: { name: true } },
                    },
                },
            },
        });
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
