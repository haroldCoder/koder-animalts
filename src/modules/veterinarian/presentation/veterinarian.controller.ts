import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateVeterinarianUseCase, FindClinicOfVeterinarianUseCase, GetVeterinarianByIdUseCase } from "@veterinarian/application/use-cases";
import { CreateVeterinarianDto } from "@veterinarian/presentation/dtos";

@Controller('veterinarian')
export class VeterinarianController {
    constructor(
        private readonly createVeterinarianUseCase: CreateVeterinarianUseCase,
        private readonly findClinicOfVeterinarianUseCase: FindClinicOfVeterinarianUseCase,
        private readonly getVeterinarianByIdUseCase: GetVeterinarianByIdUseCase
    ) { }

    @Post("create")
    async createVeterinarian(@Body() veterinarian: CreateVeterinarianDto) {
        return this.createVeterinarianUseCase.execute(veterinarian);
    }

    @Get("find-clinic/:veterinarianId")
    async findClinicOfVeterinarian(@Param("veterinarianId") veterinarianId: string) {
        return this.findClinicOfVeterinarianUseCase.execute(veterinarianId);
    }

    @Get(":id")
    async getVeterinarianById(@Param("id") id: string) {
        return this.getVeterinarianByIdUseCase.execute(id);
    }
}
