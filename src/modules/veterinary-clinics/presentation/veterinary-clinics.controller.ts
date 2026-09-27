import { ResponseDto } from "@/common/domain/dto";
import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import {
    CreateVeterinaryClinicUseCase,
    FindAllVeterinaryClinicsUseCase,
    GetVeterinaryClinicSummaryUseCase
} from "@veterinary-clinics/application/use-cases";
import { GetAllVeterinarianOfClinicUseCase } from "@veterinary-clinics/application/use-cases/get-all-veterinarian-of-clinic.use-case";
import { ResponseFindVeterinariansDto } from "@veterinary-clinics/domain/dtos";
import { RegisterVeterinaryClinicDto } from "@veterinary-clinics/presentation/dtos";

@Controller('veterinary-clinics')
export class VeterinaryClinicsController {
    constructor(
        private readonly createVeterinaryClinicUseCase: CreateVeterinaryClinicUseCase,
        private readonly findAllVeterinaryClinicsUseCase: FindAllVeterinaryClinicsUseCase,
        private readonly getVeterinaryClinicSummaryUseCase: GetVeterinaryClinicSummaryUseCase,
        private readonly getAllVeterinarianOfClinicUseCase: GetAllVeterinarianOfClinicUseCase,
    ) { }

    @Post("register")
    async createVeterinaryClinic(@Body() data: RegisterVeterinaryClinicDto) {
        return this.createVeterinaryClinicUseCase.execute(data);
    }

    @Get("all")
    async findAllVeterinaryClinics() {
        return this.findAllVeterinaryClinicsUseCase.execute();
    }

    @Get("all/veterinarians/:clinicId")
    async findAllVeterinariansOfClinc(@Param("clinicId") clinicId: string): Promise<ResponseDto<ResponseFindVeterinariansDto[]>> {
        const veterinarians = await this.getAllVeterinarianOfClinicUseCase.execute(clinicId);
        return new ResponseDto(HttpStatus.OK, "Veterinarians found successfully", veterinarians);
    }

    @Get("summary/veterinarian/userId/:userId")
    async getVeterinaryClinicSummary(@Param("userId") userId: string) {
        return this.getVeterinaryClinicSummaryUseCase.execute(userId);
    }
}
