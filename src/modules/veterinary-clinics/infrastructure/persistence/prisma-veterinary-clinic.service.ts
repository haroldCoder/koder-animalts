import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { IVeterinaryClinicRepository } from "@veterinary-clinics/domain/ports";
import { VeterinaryClinicSummaryModel } from "@veterinary-clinics/domain/models";
import { UserIdNotFoundException } from "@/common/domain/exceptions";
import { VeterinaryClinicNotFoundException } from "@veterinary-clinics/domain/exceptions";
import { VeterinaryClinicEntity } from "@veterinary-clinics/domain/entities/veterinary-clinic.entity";

@Injectable()
export class PrismaVeterinaryClinicService implements IVeterinaryClinicRepository {
    constructor(private readonly prisma: PrismaService) { }

    private mapToDomain(clinic: any): VeterinaryClinicEntity {
        return VeterinaryClinicEntity.create({
            id: clinic.id,
            name: clinic.name,
            address: clinic.address,
            phone: clinic.phone,
            email: clinic.email,
            createdAt: clinic.createdAt,
            updatedAt: clinic.updatedAt,
        });
    }

    async create(entity: VeterinaryClinicEntity): Promise<string> {
        const { id } = await this.prisma.veterinaryClinic.create({
            data: {
                id: entity.getId(),
                name: entity.getName(),
                address: entity.getAddress(),
                phone: entity.getPhone(),
                email: entity.getEmail(),
            }
        });
        return id;
    }

    async findAll(): Promise<VeterinaryClinicEntity[]> {
        const clinics = await this.prisma.veterinaryClinic.findMany();
        return clinics.map(clinic => this.mapToDomain(clinic));
    }

    async getSummaryByVeterinarianUserId(userId: string): Promise<VeterinaryClinicSummaryModel> {
        if (!userId) throw new UserIdNotFoundException();

        const clinic = await this.prisma.veterinaryClinic.findFirst({
            where: {
                veterinarians: {
                    some: { userId }
                }
            },
            include: {
                pets: {
                    select: {
                        ownerId: true
                    }
                },
                _count: {
                    select: {
                        pets: true
                    }
                }
            }
        });

        if (!clinic) throw new VeterinaryClinicNotFoundException();

        const uniqueOwners = new Set(clinic.pets.map(p => p.ownerId));

        return {
            totalPets: clinic._count.pets,
            totalUsers: uniqueOwners.size,
            clinicName: clinic.name
        };
    }
}

