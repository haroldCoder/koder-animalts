import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { RegisterVeterinaryClinicDto } from "@veterinary-clinics/infrastructure/dto";
import { ResponseDto } from "@/common/domain/dto/response.dto";
import { VeterinaryClinicEntity } from "@veterinary-clinics/domain/entities";
import { NameClinicNotFoundException, EmailOrPhoneNotFoundException } from "@veterinary-clinics/domain/exceptions";
import { AdressNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class VeterinaryClinicsService {
    constructor(private readonly prisma: PrismaService) { }

    async createVeterinaryClinic(data: RegisterVeterinaryClinicDto) {
        const { name, address, phone, email } = data;

        if (!name) throw new NameClinicNotFoundException();
        if (!address) throw new AdressNotFoundException();
        if (!phone && !email) throw new EmailOrPhoneNotFoundException();

        return this.prisma.veterinaryClinic.create({
            data,
        });
    }

    async findAllVeterinaryClinics(): Promise<ResponseDto<VeterinaryClinicEntity[]>> {
        const veterinaryClinics = await this.prisma.veterinaryClinic.findMany();
        return {
            statusCode: 200,
            data: veterinaryClinics
        };
    }
}