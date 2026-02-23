import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { CreateVeterinarianDto, ResponseFindClinicDto } from "@veterinarian/infrastructure/dto";
import { ResponseDto } from "@/common/dto/response.dto";
import { PhoneNotFoundException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { ClinicIdNotFoundException, VeterinarianIdNotFoundException, VeterinarianIdNotExistException } from "@veterinarian/domain/exceptions";

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
}