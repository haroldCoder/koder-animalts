import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { CreateVeterinarianDto } from "@veterinarian/infrastructure/dto";
import { ResponseDto } from "@/common/dto/response.dto";
import { PhoneNotFoundException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { ClinicIdNotFoundException } from "@veterinarian/domain/exceptions";

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
}