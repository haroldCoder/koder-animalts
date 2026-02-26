import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { VaccinationService } from "./vaccination.service";
import { RegisterVaccinationDto } from "./dto";

@Controller('vaccination')
export class VaccinationController {
    constructor(private readonly vaccineService: VaccinationService) { }

    @Post("register")
    async registerVaccination(@Body() dto: RegisterVaccinationDto) {
        return this.vaccineService.registerVaccination(dto);
    }

    @Get("pet/:petId/upcoming")
    async getUpcomingVaccinationsByPetId(@Param("petId") petId: string) {
        return this.vaccineService.getUpcomingVaccinationsByPetId(petId);
    }

    @Get("pet/:petId/next-reminder")
    async getNextVaccinationReminder(@Param("petId") petId: string) {
        return this.vaccineService.getNextVaccinationReminder(petId);
    }
}
