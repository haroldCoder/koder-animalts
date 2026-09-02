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

    @Post("register")
    async registerVaccination(@Body() dto: RegisterVaccinationDto) {
        return this.registerVaccinationUseCase.execute(dto);
    }

    @Get("pet/:petId/upcoming")
    async getUpcomingVaccinationsByPetId(@Param("petId") petId: string) {
        return this.getUpcomingVaccinationsByPetUseCase.execute(petId);
    }

    @Get("pet/:petId/next-reminder")
    async getNextVaccinationReminder(@Param("petId") petId: string) {
        return this.getNextVaccinationReminderUseCase.execute(petId);
    }

    @Get("user/:userId")
    async findVaccinationsByUserId(
        @Param("userId") userId: string,
        @Query() criteria: FindVaccinationsCriteriaDto
    ) {
        return this.findVaccinationsByUserIdUseCase.execute(userId, criteria);
    }

    @Get(":id")
    async getVaccinationById(@Param("id") id: string) {
        return this.getVaccinationByIdUseCase.execute(id);
    }

    @Put("status/:id")
    async updateStatus(@Param("id") id: string, @Body() dto: UpdateStatusVaccinationDto) {
        return this.updateStatusVaccinationUseCase.execute(id, dto.status);
    }
}

