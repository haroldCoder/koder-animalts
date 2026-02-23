import { VeterinaryClinicsService } from "@veterinary-clinics/infrastructure/veterinary-clinics.service";
import { Controller, Post, Body, Get } from "@nestjs/common";
import { RegisterVeterinaryClinicDto } from "@veterinary-clinics/infrastructure/dto";

@Controller('veterinary-clinics')
export class VeterinaryClinicsController {
    constructor(private readonly veterinaryClinicsService: VeterinaryClinicsService) { }

    @Post("register")
    async createVeterinaryClinic(@Body() data: RegisterVeterinaryClinicDto) {
        return this.veterinaryClinicsService.createVeterinaryClinic(data);
    }

    @Get()
    async findAllVeterinaryClinics() {
        return this.veterinaryClinicsService.findAllVeterinaryClinics();
    }
}