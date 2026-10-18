import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { AuthController } from "@auth/presentation";
import {
    AuthenticateUseCase,
    GetProfileUseCase,
    LoginUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    SignUpUseCase,
    CompleteRegistrationUseCase,
} from "@auth/application/use-cases";
import { PrismaAuthService, LocalStorageAuthService } from "@auth/infrastructure/persistence";
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
        CompleteRegistrationUseCase,
        RefreshTokenUseCase,
        LogoutUseCase,
        GetProfileUseCase,
        JwtAuthGuard,
        LocalStorageAuthService,
        PrismaAuthService,
        {
            provide: "IAuthRepository",
            useFactory: (prismaService: PrismaService) => {
                const isLocal = process.env.AUTH_REPO === "local" || process.env.STORAGE_DRIVER === "local";
                if (isLocal) {
                    return new LocalStorageAuthService();
                }
                return new PrismaAuthService(prismaService);
            },
            inject: [PrismaService],
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
        CompleteRegistrationUseCase,
        RefreshTokenUseCase,
        LogoutUseCase,
        GetProfileUseCase,
        JwtAuthGuard,
        LocalStorageAuthService,
        "ITokenService",
        "IAuthRepository",
        JwtModule,
    ],
})
export class AuthModule { }
