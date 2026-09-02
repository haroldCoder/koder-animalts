import { Body, Controller, Get, Param, Post, Put, BadRequestException, HttpException, HttpStatus, Query } from "@nestjs/common";
import { RegisterAppointmentDto, UpdateAppointmentStatusDto } from "./dtos";
import {
    CreateAppointmentUseCase,
    GetAppointmentByIdUseCase,
    GetAppointmentsByUserUseCase,
    UpdateAppointmentStatusUseCase
} from "../application/use-cases";
import { ResponseDto } from "@/common/domain/dto/response.dto";
import type { FindAppointmentsCriteria } from "@appointment/domain/ports/appointment.repository";

@Controller('appointment')
export class AppointmentController {
    constructor(
        private readonly createAppointmentUseCase: CreateAppointmentUseCase,
        private readonly getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
        private readonly getAppointmentsByUserUseCase: GetAppointmentsByUserUseCase,
        private readonly updateAppointmentStatusUseCase: UpdateAppointmentStatusUseCase
    ) { }

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

    @Get("user/:id")
    async getAppointmentsByUser(
        @Param("id") id: string,
        @Query() criteria: FindAppointmentsCriteria
    ) {
        try {
            const appointments = await this.getAppointmentsByUserUseCase.execute(id, criteria);
            return new ResponseDto(HttpStatus.OK, "Appointments found", appointments);
        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new BadRequestException(error.message);
        }
    }

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
