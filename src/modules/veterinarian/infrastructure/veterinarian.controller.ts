import { Controller, Post, Body } from "@nestjs/common";
import { VeterinarianService } from "@veterinarian/infrastructure/veterinarian.service";
import { CreateVeterinarianDto } from "@veterinarian/infrastructure/dto";

@Controller('veterinarian')
export class VeterinarianController {
    constructor(private readonly veterinarianService: VeterinarianService) { }

    @Post("create")
    async createVeterinarian(@Body() veterinarian: CreateVeterinarianDto) {
        return this.veterinarianService.createVeterinarian(veterinarian);
    }
}