import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { Body, Controller, Get, Param, ParseArrayPipe, Post, Put, Query } from "@nestjs/common";
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

    @ApiOperation({ summary: 'Register vaccination' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Post("register")
    async registerVaccination(@Body() dto: RegisterVaccinationDto) {
        return this.registerVaccinationUseCase.execute(dto);
    }

    @ApiOperation({ summary: 'Get upcoming vaccinations by pet id' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get("pet/:petId/upcoming")
    async getUpcomingVaccinationsByPetId(@Param("petId") petId: string) {
        return this.getUpcomingVaccinationsByPetUseCase.execute(petId);
    }

    @ApiOperation({ summary: 'Get next vaccination reminder' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get("pet/:petId/next-reminder")
    async getNextVaccinationReminder(@Param("petId") petId: string) {
        return this.getNextVaccinationReminderUseCase.execute(petId);
    }

    @ApiOperation({ summary: 'Find vaccinations by user id' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get("user/:userId")
    async findVaccinationsByUserId(
        @Param("userId") userId: string,
        @Query() criteria: FindVaccinationsCriteriaDto
    ) {
        return this.findVaccinationsByUserIdUseCase.execute(userId, criteria);
    }

    @ApiOperation({ summary: 'Get vaccination by id' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get(":id")
    async getVaccinationById(@Param("id") id: string) {
        return this.getVaccinationByIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Update status' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Put("status/:id")
    async updateStatus(@Param("id") id: string, @Body() dto: UpdateStatusVaccinationDto) {
        return this.updateStatusVaccinationUseCase.execute(id, dto.status);
    }
}

