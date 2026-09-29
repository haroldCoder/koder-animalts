import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Put, BadRequestException, HttpException, HttpStatus, Query } from "@nestjs/common";
import { RegisterAppointmentDto, UpdateAppointmentStatusDto } from "./dtos";
import {
    CreateAppointmentUseCase,
    GetAppointmentByIdUseCase,
    GetAppointmentsByUserUseCase,
    UpdateAppointmentStatusUseCase
} from "../application/use-cases";
import { ResponseDto } from "@/common/domain/dto/response.dto";
import { FindAppointmentsCriteriaDto } from "./dtos/find-appointment-criteria.dto";

@ApiTags('Appointment')
@Controller('appointment')
export class AppointmentController {
    constructor(
        private readonly createAppointmentUseCase: CreateAppointmentUseCase,
        private readonly getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
        private readonly getAppointmentsByUserUseCase: GetAppointmentsByUserUseCase,
        private readonly updateAppointmentStatusUseCase: UpdateAppointmentStatusUseCase
    ) { }

    @ApiOperation({ summary: 'Crear una nueva cita' })
    @ApiResponse({ status: 201, description: 'Cita creada exitosamente.', type: ResponseDto })
    @ApiResponse({ status: 400, description: 'Datos de la cita inválidos o solicitud incorrecta.' })
    @Post("register")
    async createAppointment(@Body() appointment: RegisterAppointmentDto) {
        try {
            const data = await this.createAppointmentUseCase.execute(appointment);
            return new ResponseDto(HttpStatus.CREATED, "Appointment created successfully", data);
        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new BadRequestException(error.message);
        }
    }

    @ApiOperation({ summary: 'Obtener cita por ID' })
    @ApiParam({ name: 'id', description: 'ID de la cita', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Cita encontrada exitosamente.', type: ResponseDto })
    @ApiResponse({ status: 404, description: 'Cita no encontrada.' })
    @Get("/:id")
    async getAppointmentById(@Param("id") id: string) {
        try {
            const data = await this.getAppointmentByIdUseCase.execute(id);
            return new ResponseDto(HttpStatus.OK, "Appointment found", data);
        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new BadRequestException(error.message);
        }
    }

    @ApiOperation({ summary: 'Obtener citas por ID de usuario con criterios' })
    @ApiParam({ name: 'id', description: 'ID del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Citas encontradas exitosamente.', type: ResponseDto })
    @ApiResponse({ status: 400, description: 'Solicitud o criterios de búsqueda inválidos.' })
    @Get("user/:id")
    async getAppointmentsByUser(
        @Param("id") id: string,
        @Query() criteria: FindAppointmentsCriteriaDto
    ) {
        try {
            const appointments = await this.getAppointmentsByUserUseCase.execute(id, criteria);
            return new ResponseDto(HttpStatus.OK, "Appointments found", appointments);
        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new BadRequestException(error.message);
        }
    }

    @ApiOperation({ summary: 'Actualizar el estado de una cita' })
    @ApiParam({ name: 'id', description: 'ID de la cita', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Estado de la cita actualizado exitosamente.', type: ResponseDto })
    @ApiResponse({ status: 400, description: 'Estado o transición de estado inválida.' })
    @ApiResponse({ status: 404, description: 'Cita no encontrada.' })
    @Put(":id/status")
    async updateAppointmentStatus(@Param("id") id: string, @Body() data: UpdateAppointmentStatusDto) {
        try {
            const updated = await this.updateAppointmentStatusUseCase.execute(id, data);
            return new ResponseDto(HttpStatus.OK, "Appointment status updated", updated);
        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new BadRequestException(error.message);
        }
    }
}
