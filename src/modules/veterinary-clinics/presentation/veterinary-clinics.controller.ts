import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
    CreateVeterinaryClinicUseCase,
    FindAllVeterinaryClinicsUseCase,
    GetVeterinaryClinicSummaryUseCase
} from "@veterinary-clinics/application/use-cases";
import { RegisterVeterinaryClinicDto } from "@veterinary-clinics/presentation/dtos";

@Controller('veterinary-clinics')
export class VeterinaryClinicsController {
    constructor(
        private readonly createVeterinaryClinicUseCase: CreateVeterinaryClinicUseCase,
        private readonly findAllVeterinaryClinicsUseCase: FindAllVeterinaryClinicsUseCase,
        private readonly getVeterinaryClinicSummaryUseCase: GetVeterinaryClinicSummaryUseCase,
    ) { }

    @Post("register")
    async createVeterinaryClinic(@Body() data: RegisterVeterinaryClinicDto) {
        return this.createVeterinaryClinicUseCase.execute(data);
    }

    @Get("all")
    async findAllVeterinaryClinics() {
        return this.findAllVeterinaryClinicsUseCase.execute();
    }

    @Get("summary/veterinarian/userId/:userId")
    async getVeterinaryClinicSummary(@Param("userId") userId: string) {
        return this.getVeterinaryClinicSummaryUseCase.execute(userId);
    }
}
