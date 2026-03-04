import { Body, Controller, Get, Post } from "@nestjs/common";
import {
    CreateVeterinaryClinicUseCase,
    FindAllVeterinaryClinicsUseCase,
} from "@veterinary-clinics/application/use-cases";
import { RegisterVeterinaryClinicDto } from "@veterinary-clinics/presentation/dtos";

@Controller('veterinary-clinics')
export class VeterinaryClinicsController {
    constructor(
        private readonly createVeterinaryClinicUseCase: CreateVeterinaryClinicUseCase,
        private readonly findAllVeterinaryClinicsUseCase: FindAllVeterinaryClinicsUseCase,
    ) { }

    @Post("register")
    async createVeterinaryClinic(@Body() data: RegisterVeterinaryClinicDto) {
        return this.createVeterinaryClinicUseCase.execute(data);
    }

    @Get("all")
    async findAllVeterinaryClinics() {
        return this.findAllVeterinaryClinicsUseCase.execute();
    }
}
