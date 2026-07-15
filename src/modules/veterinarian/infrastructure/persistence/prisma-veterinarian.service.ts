import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { VeterinarianEntity } from "@veterinarian/domain/entities";
import { UserIdNotFoundException, VeterinarianIdNotExistException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";
import { VeterinarianAlreadyExistsException } from "@veterinarian/domain/exceptions";

@Injectable()
export class PrismaVeterinarianService implements IVeterinarianRepository {
    constructor(private readonly prisma: PrismaService) { }

    private mapToDomain(veterinarian: {
        id: string;
        phone: string;
        specialty?: string | null;
        userId: string;
        clinicId: string;
        createdAt?: Date;
        updatedAt?: Date;
        user?: {
            id: string;
            name: string | null;
            email: string;
        };
        clinic?: {
            id: string;
            name: string;
        };
    }): VeterinarianEntity {
        return VeterinarianEntity.create({
            id: veterinarian.id,
            phone: veterinarian.phone,
            specialty: veterinarian.specialty,
            userId: veterinarian.userId,
            clinicId: veterinarian.clinicId,
            createdAt: veterinarian.createdAt,
            updatedAt: veterinarian.updatedAt,
            user: veterinarian.user ? {
                id: veterinarian.user.id,
                name: veterinarian.user.name || "",
                email: veterinarian.user.email,
            } : undefined,
            clinic: veterinarian.clinic,
        });
    }

    async create(veterinarian: VeterinarianEntity): Promise<string> {
        const existing = await this.prisma.veterinarian.findUnique({
            where: { userId: veterinarian.getUserId() }
        });

        if (existing) throw new VeterinarianAlreadyExistsException();

        const { id } = await this.prisma.veterinarian.create({
            data: {
                id: veterinarian.getId(),
                phone: veterinarian.getPhone(),
                specialty: veterinarian.getSpecialty(),
                userId: veterinarian.getUserId(),
                clinicId: veterinarian.getClinicId(),
            }
        });
        return id;
    }

    async findByIdWithDetails(id: string): Promise<VeterinarianEntity | null> {
        if (!id) throw new VeterinarianIdNotFoundException();

        const veterinarian = await this.prisma.veterinarian.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                clinic: {
                    select: { id: true, name: true },
                }
            }
        });

        if (!veterinarian) return null;

        return this.mapToDomain(veterinarian);
    }

    async findByUserId(userId: string): Promise<VeterinarianEntity | null> {
        if (!userId) throw new UserIdNotFoundException();

        const veterinarian = await this.prisma.veterinarian.findUnique({
            where: { userId }
        });

        if (!veterinarian) return null;

        return this.mapToDomain({
            ...veterinarian,
            specialty: veterinarian.specialty || ""
        });
    }

    async findClinicByVeterinarianId(veterinarianId: string): Promise<{ id: string; name: string } | null> {
        if (!veterinarianId) throw new VeterinarianIdNotFoundException();

        const veterinarian = await this.prisma.veterinarian.findUnique({
            where: { id: veterinarianId },
            select: {
                clinic: {
                    select: { id: true, name: true }
                }
            }
        });

        if (!veterinarian) throw new VeterinarianIdNotExistException();

        return veterinarian?.clinic;
    }
}
