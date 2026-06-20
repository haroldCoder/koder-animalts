import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { IVeterinaryClinicRepository } from "@veterinary-clinics/domain/ports";
import { CreateVeterinaryClinicModel, VeterinaryClinicModel, VeterinaryClinicSummaryModel } from "@veterinary-clinics/domain/models";
import { EmailOrPhoneNotFoundException, NameClinicNotFoundException } from "@veterinary-clinics/domain/exceptions";
import { AdressNotFoundException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { VeterinaryClinicNotFoundException } from "@veterinary-clinics/domain/exceptions";

@Injectable()
export class PrismaVeterinaryClinicService implements IVeterinaryClinicRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateVeterinaryClinicModel): Promise<string> {
        const { name, address, phone, email } = data;

        if (!name) throw new NameClinicNotFoundException();
        if (!address) throw new AdressNotFoundException();
        if (!phone && !email) throw new EmailOrPhoneNotFoundException();

        const { id } = await this.prisma.veterinaryClinic.create({ data });
        return id;
    }

    async findAll(): Promise<VeterinaryClinicModel[]> {
        const clinics = await this.prisma.veterinaryClinic.findMany();
        return clinics as VeterinaryClinicModel[];
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
            total_pets: clinic._count.pets,
            total_users: uniqueOwners.size,
            clinic_name: clinic.name
        };
    }
}
