import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
    @ApiOperation({ summary: 'Create veterinarian' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Post("create")
    async createVeterinarian(@Body() veterinarian: CreateVeterinarianDto) {
        return this.createVeterinarianUseCase.execute(veterinarian);
    }

    @ApiOperation({ summary: 'Buscar clínica de un veterinario' })
    @ApiOperation({ summary: 'Find clinic of veterinarian' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get("find-clinic/:veterinarianId")
    async findClinicOfVeterinarian(@Param("veterinarianId") veterinarianId: string) {
        return this.findClinicOfVeterinarianUseCase.execute(veterinarianId);
    }

    @ApiOperation({ summary: 'Obtener veterinario por ID' })
    @ApiOperation({ summary: 'Get veterinarian by id' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get(":id")
    async getVeterinarianById(@Param("id") id: string) {
        return this.getVeterinarianByIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Obtener veterinario por ID de usuario' })
    @ApiOperation({ summary: 'Get veterinarian by user id' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get("by-user/:userId")
    async getVeterinarianByUserId(@Param("userId") userId: string) {
        return this.findVeterinarianByUserIdUseCase.execute(userId);
    }
}
