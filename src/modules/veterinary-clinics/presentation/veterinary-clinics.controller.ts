import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
    CreateVeterinaryClinicUseCase,
    FindAllVeterinaryClinicsUseCase,
    GetVeterinaryClinicSummaryUseCase
} from "@veterinary-clinics/application/use-cases";
import { RegisterVeterinaryClinicDto } from "@veterinary-clinics/presentation/dtos";

@ApiTags('Veterinary Clinics')
@Controller('veterinary-clinics')
export class VeterinaryClinicsController {
    constructor(
        private readonly createVeterinaryClinicUseCase: CreateVeterinaryClinicUseCase,
        private readonly findAllVeterinaryClinicsUseCase: FindAllVeterinaryClinicsUseCase,
        private readonly getVeterinaryClinicSummaryUseCase: GetVeterinaryClinicSummaryUseCase,
    ) { }

    @ApiOperation({ summary: 'Registrar una nueva clínica veterinaria' })
    @ApiResponse({ status: 201, description: 'La clínica ha sido creada exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
    @Post("register")
    async createVeterinaryClinic(@Body() data: RegisterVeterinaryClinicDto) {
        return this.createVeterinaryClinicUseCase.execute(data);
    }

    @ApiOperation({ summary: 'Obtener todas las clínicas veterinarias' })
    @ApiResponse({ status: 200, description: 'Lista de todas las clínicas veterinarias.' })
    @Get("all")
    async findAllVeterinaryClinics() {
        return this.findAllVeterinaryClinicsUseCase.execute();
    }

    @ApiOperation({ summary: 'Obtener resumen de clínica por ID de veterinario' })
    @ApiParam({ name: 'userId', description: 'ID del usuario (veterinario)', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Resumen de la clínica obtenido correctamente.' })
    @ApiResponse({ status: 404, description: 'Veterinario o clínica no encontrada.' })
    @Get("summary/veterinarian/userId/:userId")
    async getVeterinaryClinicSummary(@Param("userId") userId: string) {
        return this.getVeterinaryClinicSummaryUseCase.execute(userId);
    }
}
