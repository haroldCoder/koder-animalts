import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { CreateOwnerUseCase, FindOwnerByUserIdUseCase } from "@owner/application/use-cases";
import { CreateOwnerDto } from "@owner/presentation/dtos";

@ApiTags('Owner')
@Controller('owner')
export class OwnerController {
    constructor(
        private readonly createOwnerUseCase: CreateOwnerUseCase,
        private readonly findOwnerByUserIdUseCase: FindOwnerByUserIdUseCase) { }

    @ApiOperation({ summary: 'Create owner' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Post("create")
    async createOwner(@Body() owner: CreateOwnerDto) {
        return this.createOwnerUseCase.execute(owner);
    }

    @ApiOperation({ summary: 'Get owner by user id' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get("by-user/:userId")
    async getOwnerByUserId(@Param("userId") userId: string) {
        return this.findOwnerByUserIdUseCase.execute(userId);
    }
}
