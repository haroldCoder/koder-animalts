import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import {
    RegisterVaccinationUseCase,
    GetUpcomingVaccinationsByPetUseCase,
    GetNextVaccinationReminderUseCase,
    FindVaccinationsByUserIdUseCase,
    UpdateStatusVaccinationUseCase,
    GetVaccinationByIdUseCase,
} from "@vaccination/application/use-cases";
import { RegisterVaccinationDto, UpdateStatusVaccinationDto } from "@vaccination/presentation/dtos";
import { FindVaccinationsCriteriaDto } from "./dtos/find-vaccination-criteria.dto";

@ApiTags('Vaccination')
@Controller('vaccination')
export class VaccinationController {
    constructor(
        private readonly registerVaccinationUseCase: RegisterVaccinationUseCase,
        private readonly getUpcomingVaccinationsByPetUseCase: GetUpcomingVaccinationsByPetUseCase,
        private readonly getVaccinationByIdUseCase: GetVaccinationByIdUseCase,
        private readonly getNextVaccinationReminderUseCase: GetNextVaccinationReminderUseCase,
        private readonly findVaccinationsByUserIdUseCase: FindVaccinationsByUserIdUseCase,
        private readonly updateStatusVaccinationUseCase: UpdateStatusVaccinationUseCase,
    ) { }

    @ApiOperation({ summary: 'Registrar una nueva vacunación' })
    @ApiResponse({ status: 201, description: 'Vacunación registrada exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos de vacunación inválidos.' })
    @Post("register")
    async registerVaccination(@Body() dto: RegisterVaccinationDto) {
        return this.registerVaccinationUseCase.execute(dto);
    }

    @ApiOperation({ summary: 'Obtener próximas vacunaciones de una mascota' })
    @ApiParam({ name: 'petId', description: 'ID de la mascota', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Lista de próximas vacunaciones.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get("pet/:petId/upcoming")
    async getUpcomingVaccinationsByPetId(@Param("petId") petId: string) {
        return this.getUpcomingVaccinationsByPetUseCase.execute(petId);
    }

    @ApiOperation({ summary: 'Obtener recordatorio de la siguiente vacunación de una mascota' })
    @ApiParam({ name: 'petId', description: 'ID de la mascota', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Recordatorio de siguiente vacunación.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get("pet/:petId/next-reminder")
    async getNextVaccinationReminder(@Param("petId") petId: string) {
        return this.getNextVaccinationReminderUseCase.execute(petId);
    }

    @ApiOperation({ summary: 'Buscar vacunaciones por ID de usuario con criterios' })
    @ApiParam({ name: 'userId', description: 'ID del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Lista de vacunaciones encontradas.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get("user/:userId")
    async findVaccinationsByUserId(
        @Param("userId") userId: string,
        @Query() criteria: FindVaccinationsCriteriaDto
    ) {
        return this.findVaccinationsByUserIdUseCase.execute(userId, criteria);
    }

    @ApiOperation({ summary: 'Obtener una vacunación por su ID' })
    @ApiParam({ name: 'id', description: 'ID de la vacunación', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Vacunación encontrada exitosamente.' })
    @ApiResponse({ status: 404, description: 'Vacunación no encontrada.' })
    @Get(":id")
    async getVaccinationById(@Param("id") id: string) {
        return this.getVaccinationByIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Actualizar el estado de una vacunación' })
    @ApiParam({ name: 'id', description: 'ID de la vacunación', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Estado de la vacunación actualizado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida o estado no permitido.' })
    @Put("status/:id")
    async updateStatus(@Param("id") id: string, @Body() dto: UpdateStatusVaccinationDto) {
        return this.updateStatusVaccinationUseCase.execute(id, dto.status);
    }
}

