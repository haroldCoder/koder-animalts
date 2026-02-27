import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { CreateVeterinarianModel, VeterinarianModel, VeterinarianWithDetailsModel } from "@veterinarian/domain/models";
import { VeterinarianIdNotExistException } from "@/common/domain/exceptions";
import { VeterinarianAlreadyExistsException } from "@veterinarian/domain/exceptions";

@Injectable()
export class PrismaVeterinarianService implements IVeterinarianRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateVeterinarianModel): Promise<string> {
        const veterinarian = await this.findByUserId(data.userId);

        if (veterinarian) throw new VeterinarianAlreadyExistsException();


        const { id } = await this.prisma.veterinarian.create({ data });
        return id;
    }

    async findByIdWithDetails(id: string): Promise<VeterinarianWithDetailsModel | null> {
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

        return {
            ...veterinarian,
            user: { ...veterinarian.user, name: veterinarian.user.name || "" },
        } as VeterinarianWithDetailsModel;
    }

    async findByUserId(userId: string): Promise<VeterinarianModel | null> {
        const veterinarian = await this.prisma.veterinarian.findUnique({
            where: { userId }
        });

        if (!veterinarian) throw new VeterinarianIdNotExistException();

        return {
            ...veterinarian,
            specialty: veterinarian?.specialty || ""
        };
    }

    async findClinicByVeterinarianId(veterinarianId: string): Promise<{ id: string; name: string } | null> {
        const veterinarian = await this.prisma.veterinarian.findUnique({
            where: { id: veterinarianId },
            select: {
                clinic: {
                    select: { id: true, name: true }
                }
            }
        });

        return veterinarian?.clinic || null;
    }
}
