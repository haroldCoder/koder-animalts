import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
    RegisterVaccinationUseCase,
    GetUpcomingVaccinationsByPetUseCase,
    GetNextVaccinationReminderUseCase,
} from "@vaccination/application/use-cases";
import { RegisterVaccinationDto } from "@vaccination/presentation/dtos";

@Controller('vaccination')
export class VaccinationController {
    constructor(
        private readonly registerVaccinationUseCase: RegisterVaccinationUseCase,
        private readonly getUpcomingVaccinationsByPetUseCase: GetUpcomingVaccinationsByPetUseCase,
        private readonly getNextVaccinationReminderUseCase: GetNextVaccinationReminderUseCase,
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
}
