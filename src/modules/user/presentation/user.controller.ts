import { Controller, Get, Param } from "@nestjs/common";
import { GetUserRoleUseCase } from "@user/application/use-cases";
import { UserWithRoleModel } from "@user/domain/models";

@Controller('users')
export class UserController {
    constructor(private readonly getUserRoleUseCase: GetUserRoleUseCase) { }

    @Get(':id/role')
    async getRole(@Param('id') id: string): Promise<UserWithRoleModel> {
        return this.getUserRoleUseCase.execute(id);
    }
}
