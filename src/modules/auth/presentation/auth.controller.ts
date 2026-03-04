import { Body, Controller, Post } from "@nestjs/common";
import { AuthenticateUseCase } from "@auth/application/use-cases";
import { AuthenticateParamsDto } from "@auth/presentation/dtos";

@Controller("auth")
export class AuthController {
    constructor(private readonly authenticateUseCase: AuthenticateUseCase) { }

    @Post("login")
    async login(@Body() params: AuthenticateParamsDto) {
        return this.authenticateUseCase.execute(params);
    }
}