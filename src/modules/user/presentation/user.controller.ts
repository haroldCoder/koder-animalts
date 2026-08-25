import { ResponseDto } from "@/common/domain/dto";
import { Controller, Get, Param } from "@nestjs/common";
import { GetUserRoleUseCase } from "@user/application/use-cases";
import { UserMetadata } from "@user/domain/ports";

@Controller('users')
export class UserController {
    constructor(private readonly getUserRoleUseCase: GetUserRoleUseCase) { }

    @Get(':id/role')
    async getRole(@Param('id') id: string): Promise<ResponseDto<UserMetadata>> {
        return this.getUserRoleUseCase.execute(id);
    }
}
