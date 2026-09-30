import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ResponseDto } from "@/common/domain/dto";
import { Controller, Get, Param } from "@nestjs/common";
import { GetUserRoleUseCase } from "@user/application/use-cases";
import { UserMetadata } from "@user/domain/ports";

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(private readonly getUserRoleUseCase: GetUserRoleUseCase) { }

    @ApiOperation({ summary: 'Obtener rol y metadatos de un usuario' })
    @ApiParam({ name: 'id', description: 'ID del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Rol y metadatos obtenidos exitosamente.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    @Get(':id/role')
    async getRole(@Param('id') id: string): Promise<ResponseDto<UserMetadata>> {
        return this.getUserRoleUseCase.execute(id);
    }
}
