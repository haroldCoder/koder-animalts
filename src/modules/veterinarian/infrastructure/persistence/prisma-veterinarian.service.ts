import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { CreateVeterinarianModel, VeterinarianModel, VeterinarianWithDetailsModel } from "@veterinarian/domain/models";
import { PhoneNotFoundException, UserIdNotFoundException, VeterinarianIdNotExistException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";
import { ClinicIdNotFoundException, VeterinarianAlreadyExistsException } from "@veterinarian/domain/exceptions";

@Injectable()
export class PrismaVeterinarianService implements IVeterinarianRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateVeterinarianModel): Promise<string> {
        const { phone, userId, clinicId } = data;

        if (!phone) throw new PhoneNotFoundException();
        if (!userId) throw new UserIdNotFoundException();
        if (!clinicId) throw new ClinicIdNotFoundException();

        const veterinarian = await this.findByUserId(userId);

        if (veterinarian) throw new VeterinarianAlreadyExistsException();

        const { id } = await this.prisma.veterinarian.create({ data });
        return id;
    }

    async findByIdWithDetails(id: string): Promise<VeterinarianWithDetailsModel | null> {
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

        if (!veterinarian) throw new VeterinarianIdNotExistException();

        return {
            ...veterinarian,
            user: { ...veterinarian.user, name: veterinarian.user.name || "" },
        } as VeterinarianWithDetailsModel;
    }

    async findByUserId(userId: string): Promise<VeterinarianModel | null> {
        if (!userId) throw new UserIdNotFoundException();

        const veterinarian = await this.prisma.veterinarian.findUnique({
            where: { userId }
        });

        if (!veterinarian) return null;

        return {
            ...veterinarian,
            specialty: veterinarian?.specialty || ""
        };
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
