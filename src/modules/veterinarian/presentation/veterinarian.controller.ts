import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
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
    @ApiResponse({ status: 201, description: 'Veterinario registrado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida o datos incorrectos.' })
    @Post("create")
    async createVeterinarian(@Body() veterinarian: CreateVeterinarianDto) {
        return this.createVeterinarianUseCase.execute(veterinarian);
    }

    @ApiOperation({ summary: 'Buscar clínica de un veterinario' })
    @ApiParam({ name: 'veterinarianId', description: 'ID del veterinario', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Clínica encontrada exitosamente.' })
    @ApiResponse({ status: 404, description: 'Veterinario o clínica no encontrada.' })
    @Get("find-clinic/:veterinarianId")
    async findClinicOfVeterinarian(@Param("veterinarianId") veterinarianId: string) {
        return this.findClinicOfVeterinarianUseCase.execute(veterinarianId);
    }

    @ApiOperation({ summary: 'Obtener veterinario por ID' })
    @ApiParam({ name: 'id', description: 'ID del veterinario', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Veterinario encontrado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Veterinario no encontrado.' })
    @Get(":id")
    async getVeterinarianById(@Param("id") id: string) {
        return this.getVeterinarianByIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Obtener veterinario por ID de usuario' })
    @ApiParam({ name: 'userId', description: 'ID del usuario asociado al veterinario', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Veterinario encontrado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Veterinario no encontrado para este usuario.' })
    @Get("by-user/:userId")
    async getVeterinarianByUserId(@Param("userId") userId: string) {
        return this.findVeterinarianByUserIdUseCase.execute(userId);
    }
}
