import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import {
    RegisterVaccinationUseCase,
    GetUpcomingVaccinationsByPetUseCase,
    GetNextVaccinationReminderUseCase,
    FindVaccinationsByUserIdUseCase,
} from "@vaccination/application/use-cases";
import { RegisterVaccinationDto } from "@vaccination/presentation/dtos";

@Controller('vaccination')
export class VaccinationController {
    constructor(
        private readonly registerVaccinationUseCase: RegisterVaccinationUseCase,
        private readonly getUpcomingVaccinationsByPetUseCase: GetUpcomingVaccinationsByPetUseCase,
        private readonly getNextVaccinationReminderUseCase: GetNextVaccinationReminderUseCase,
        private readonly findVaccinationsByUserIdUseCase: FindVaccinationsByUserIdUseCase,
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
        @Query("page") page?: string,
        @Query("limit") limit?: string,
        @Query("medicalRecordId") medicalRecordId?: string,
    ) {
        return this.findVaccinationsByUserIdUseCase.execute(userId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            medicalRecordId,
        });
    }
}

