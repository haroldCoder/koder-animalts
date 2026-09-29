import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
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

@ApiTags('Veterinary Clinics')
@Controller('veterinary-clinics')
export class VeterinaryClinicsController {
    constructor(
        private readonly createVeterinaryClinicUseCase: CreateVeterinaryClinicUseCase,
        private readonly findAllVeterinaryClinicsUseCase: FindAllVeterinaryClinicsUseCase,
        private readonly getVeterinaryClinicSummaryUseCase: GetVeterinaryClinicSummaryUseCase,
        private readonly getAllVeterinarianOfClinicUseCase: GetAllVeterinarianOfClinicUseCase,
    ) { }

    @ApiOperation({ summary: 'Registrar una nueva clínica veterinaria' })
    @ApiResponse({ status: 201, description: 'La clínica ha sido creada exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
    @Post("register")
    async createVeterinaryClinic(@Body() data: RegisterVeterinaryClinicDto) {
        return this.createVeterinaryClinicUseCase.execute(data);
    }

    @ApiOperation({ summary: 'Obtener todas las clínicas veterinarias' })
    @ApiResponse({ status: 200, description: 'Lista de todas las clínicas veterinarias.' })
    @Get("all")
    async findAllVeterinaryClinics() {
        return this.findAllVeterinaryClinicsUseCase.execute();
    }

    @ApiOperation({ summary: 'Obtener resumen de clínica por ID de veterinario' })
    @ApiParam({ name: 'userId', description: 'ID del usuario (veterinario)', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Resumen de la clínica obtenido correctamente.' })
    @ApiResponse({ status: 404, description: 'Veterinario o clínica no encontrada.' })
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
