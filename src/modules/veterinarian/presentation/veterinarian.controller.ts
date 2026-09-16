import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateVeterinarianUseCase, FindClinicOfVeterinarianUseCase, FindVeterinarianByUserIdUseCase, GetVeterinarianByIdUseCase } from "@veterinarian/application/use-cases";
import { CreateVeterinarianDto } from "@veterinarian/presentation/dtos";

@ApiTags('Veterinarians')
@Controller('veterinarian')
export class VeterinarianController {
    constructor(
        private readonly createVeterinarianUseCase: CreateVeterinarianUseCase,
        private readonly findClinicOfVeterinarianUseCase: FindClinicOfVeterinarianUseCase,
        private readonly getVeterinarianByIdUseCase: GetVeterinarianByIdUseCase,
        private readonly findVeterinarianByUserIdUseCase: FindVeterinarianByUserIdUseCase
    ) { }

    @ApiOperation({ summary: 'Registrar un nuevo veterinario' })
    @Post("create")
    async createVeterinarian(@Body() veterinarian: CreateVeterinarianDto) {
        return this.createVeterinarianUseCase.execute(veterinarian);
    }

    @ApiOperation({ summary: 'Buscar clínica de un veterinario' })
    @Get("find-clinic/:veterinarianId")
    async findClinicOfVeterinarian(@Param("veterinarianId") veterinarianId: string) {
        return this.findClinicOfVeterinarianUseCase.execute(veterinarianId);
    }

    @ApiOperation({ summary: 'Obtener veterinario por ID' })
    @Get(":id")
    async getVeterinarianById(@Param("id") id: string) {
        return this.getVeterinarianByIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Obtener veterinario por ID de usuario' })
    @Get("by-user/:userId")
    async getVeterinarianByUserId(@Param("userId") userId: string) {
        return this.findVeterinarianByUserIdUseCase.execute(userId);
    }
}
