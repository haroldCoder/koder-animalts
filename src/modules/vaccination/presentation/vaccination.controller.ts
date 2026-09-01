import { Body, Controller, Get, Param, ParseArrayPipe, Post, Put, Query } from "@nestjs/common";
import {
    RegisterVaccinationUseCase,
    GetUpcomingVaccinationsByPetUseCase,
    GetNextVaccinationReminderUseCase,
    FindVaccinationsByUserIdUseCase,
    UpdateStatusVaccinationUseCase,
    GetVaccinationByIdUseCase,
} from "@vaccination/application/use-cases";
import { VaccinationStatus } from "@vaccination/domain/enums";
import { RegisterVaccinationDto, UpdateStatusVaccinationDto } from "@vaccination/presentation/dtos";

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
        @Query("page") page?: string,
        @Query("limit") limit?: string,
        @Query("medicalRecordId") medicalRecordId?: string,
        @Query("petId") petId?: string,
        @Query("startDate") startDate?: string,
        @Query("endDate") endDate?: string,
        @Query("status", new ParseArrayPipe({ items: String, optional: true, separator: "," })) status?: VaccinationStatus[],
    ) {
        return this.findVaccinationsByUserIdUseCase.execute(userId, {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            medicalRecordId,
            petId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            status,
        });
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

