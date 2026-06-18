import { Module } from "@nestjs/common";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { AuthController } from "@auth/presentation";
import { AuthenticateUseCase, LoginUseCase, SignUpUseCase } from "@auth/application/use-cases";
import { PrismaAuthService } from "@auth/infrastructure/persistence";

@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers: [
        AuthenticateUseCase,
        LoginUseCase,
        SignUpUseCase,
        {
            provide: "IAuthRepository",
            useClass: PrismaAuthService
        }
    ],
    exports: [AuthenticateUseCase, LoginUseCase, SignUpUseCase]
})
export class AuthModule { }
