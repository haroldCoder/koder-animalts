import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { CreateOwnerUseCase, FindOwnerByUserIdUseCase } from "@owner/application/use-cases";
import { CreateOwnerDto } from "@owner/presentation/dtos";

@ApiTags('Owner')
@Controller('owner')
export class OwnerController {
    constructor(
        private readonly createOwnerUseCase: CreateOwnerUseCase,
        private readonly findOwnerByUserIdUseCase: FindOwnerByUserIdUseCase) { }

    @ApiOperation({ summary: 'Registrar un nuevo propietario' })
    @ApiResponse({ status: 201, description: 'Propietario registrado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o incompletos.' })
    @Post("create")
    async createOwner(@Body() owner: CreateOwnerDto) {
        return this.createOwnerUseCase.execute(owner);
    }

    @ApiOperation({ summary: 'Obtener información del propietario por ID de usuario' })
    @ApiParam({ name: 'userId', description: 'ID del usuario propietario', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Propietario encontrado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Propietario no encontrado.' })
    @Get("by-user/:userId")
    async getOwnerByUserId(@Param("userId") userId: string) {
        return this.findOwnerByUserIdUseCase.execute(userId);
    }
}
