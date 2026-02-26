import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { CreateVeterinarianDto, ResponseFindClinicDto } from "@veterinarian/infrastructure/dto";
import { ResponseDto } from "@/common/domain/dto/response.dto";
import { PhoneNotFoundException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { ClinicIdNotFoundException } from "@veterinarian/domain/exceptions";
import { VeterinarianEntity } from "@veterinarian/domain/entities";
import { VeterinarianIdNotExistException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";
import { VeterinaryClinicEntity } from "@veterinary-clinics/domain/entities";

@Injectable()
export class VeterinarianService {
    constructor(private readonly prisma: PrismaService) { }

    async createVeterinarian(veterinarian: CreateVeterinarianDto): Promise<ResponseDto<string>> {
        const { phone, userId, clinicId } = veterinarian;

        if (!phone) throw new PhoneNotFoundException();
        if (!userId) throw new UserIdNotFoundException();
        if (!clinicId) throw new ClinicIdNotFoundException();

        const veterinarianCreated = await this.prisma.veterinarian.create({ data: veterinarian });

        return {
            message: "Veterinarian created successfully",
            statusCode: 201,
            data: veterinarianCreated.id,
        };
    }

    async findClinicOfVeterinarian(veterinarianId: string): Promise<ResponseDto<ResponseFindClinicDto>> {
        if (!veterinarianId) throw new VeterinarianIdNotFoundException();

        const veterinarian = await this.prisma.veterinarian.findUnique({
            where: { id: veterinarianId },
            include: {
                user: {
                    select: { id: true, name: true },
                },
                clinic: {
                    select: { id: true, name: true },
                }
            }
        });

        if (!veterinarian) throw new VeterinarianIdNotExistException();

        return {
            message: "Veterinarian found successfully",
            statusCode: 200,
            data: {
                user: veterinarian.user,
                clinic: veterinarian.clinic,
                specialty: veterinarian.specialty,
                phone: veterinarian.phone,
            },
        };
    }

    async getVeterinarianById(id: string): Promise<VeterinarianEntity> {
        const veterinarian = await this.prisma.veterinarian.findUnique({
            where: { id },
            select: {
                id: true,
                specialty: true,
                phone: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                clinic: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!veterinarian) {
            throw new VeterinarianIdNotExistException();
        }

        return {
            ...veterinarian,
            phone: veterinarian.phone || "",
            specialty: veterinarian.specialty || "",
            user: { ...veterinarian.user, name: veterinarian.user.name || "" },
            clinic: { ...veterinarian.clinic }
        };
    }

    async getVeterinaryClinicByVeterinarianId(veterinarianId: string): Promise<VeterinaryClinicEntity> {
        const veterinarian = await this.prisma.veterinarian.findUnique({
            where: { id: veterinarianId },
            include: {
                clinic: true
            },
        });

        if (!veterinarian) {
            throw new VeterinarianIdNotExistException();
        }

        return veterinarian.clinic;
    }
}