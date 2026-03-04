import { Module } from "@nestjs/common";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { AuthController } from "@auth/presentation";
import { AuthenticateUseCase } from "@auth/application/use-cases";
import { PrismaAuthService } from "@auth/infrastructure/persistence";

@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers: [
        AuthenticateUseCase,
        {
            provide: "IAuthRepository",
            useClass: PrismaAuthService
        }
    ],
    exports: [AuthenticateUseCase]
})
export class AuthModule { }
