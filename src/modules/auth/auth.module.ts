import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { AuthController } from "@auth/presentation";
import {
    AuthenticateUseCase,
    GetProfileUseCase,
    LoginUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    SignUpUseCase,
} from "@auth/application/use-cases";
import { PrismaAuthService } from "@auth/infrastructure/persistence";
import { JwtTokenService } from "@auth/infrastructure/services";
import { JwtAuthGuard } from "@auth/infrastructure/guards";

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || "koder-animalts-jwt-secret-key-2026",
            signOptions: { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "1h") as any },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthenticateUseCase,
        LoginUseCase,
        SignUpUseCase,
        RefreshTokenUseCase,
        LogoutUseCase,
        GetProfileUseCase,
        JwtAuthGuard,
        {
            provide: "IAuthRepository",
            useClass: PrismaAuthService,
        },
        {
            provide: "ITokenService",
            useClass: JwtTokenService,
        },
    ],
    exports: [
        AuthenticateUseCase,
        LoginUseCase,
        SignUpUseCase,
        RefreshTokenUseCase,
        LogoutUseCase,
        GetProfileUseCase,
        JwtAuthGuard,
        "ITokenService",
        "IAuthRepository",
        JwtModule,
    ],
})
export class AuthModule { }
