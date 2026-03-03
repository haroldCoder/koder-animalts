import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { IVeterinaryClinicRepository } from "@veterinary-clinics/domain/ports";
import { CreateVeterinaryClinicModel, VeterinaryClinicModel } from "@veterinary-clinics/domain/models";

@Injectable()
export class PrismaVeterinaryClinicService implements IVeterinaryClinicRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateVeterinaryClinicModel): Promise<string> {
        const { id } = await this.prisma.veterinaryClinic.create({ data });
        return id;
    }

    async findAll(): Promise<VeterinaryClinicModel[]> {
        const clinics = await this.prisma.veterinaryClinic.findMany();
        return clinics as VeterinaryClinicModel[];
    }
}
