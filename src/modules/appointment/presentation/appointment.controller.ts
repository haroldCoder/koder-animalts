import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
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

    @ApiOperation({ summary: 'Create appointment' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
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

    @ApiOperation({ summary: 'Get appointment by id' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
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

    @ApiOperation({ summary: 'Get appointments by user' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
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

    @ApiOperation({ summary: 'Update appointment status' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
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
