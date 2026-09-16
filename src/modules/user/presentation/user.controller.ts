import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from "@/common/domain/dto";
import { Controller, Get, Param } from "@nestjs/common";
import { GetUserRoleUseCase } from "@user/application/use-cases";
import { UserMetadata } from "@user/domain/ports";

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(private readonly getUserRoleUseCase: GetUserRoleUseCase) { }

    @ApiOperation({ summary: 'Get role' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Get(':id/role')
    async getRole(@Param('id') id: string): Promise<ResponseDto<UserMetadata>> {
        return this.getUserRoleUseCase.execute(id);
    }
}
