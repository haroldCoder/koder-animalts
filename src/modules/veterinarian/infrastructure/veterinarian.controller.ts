import { Controller, Post, Body, Param, Get } from "@nestjs/common";
import { VeterinarianService } from "@veterinarian/infrastructure/veterinarian.service";
import { CreateVeterinarianDto } from "@veterinarian/infrastructure/dto";

@Controller('veterinarian')
export class VeterinarianController {
    constructor(private readonly veterinarianService: VeterinarianService) { }

    @Post("create")
    async createVeterinarian(@Body() veterinarian: CreateVeterinarianDto) {
        return this.veterinarianService.createVeterinarian(veterinarian);
    }

    @Get("find-clinic/:veterinarianId")
    async findClinicOfVeterinarian(@Param("veterinarianId") veterinarianId: string) {
        return this.veterinarianService.findClinicOfVeterinarian(veterinarianId);
    }
}