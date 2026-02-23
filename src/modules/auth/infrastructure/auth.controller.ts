import { Body, Controller, Post } from "@nestjs/common";
import { LoginService } from "@auth/infrastructure/login.service";
import { AuthenticateParamsDto } from "@auth/infrastructure/dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly loginService: LoginService) { }

    @Post("login")
    async login(@Body() params: AuthenticateParamsDto) {
        return this.loginService.authenticate(params);
    }
}