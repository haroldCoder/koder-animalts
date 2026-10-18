import { Module } from "@nestjs/common";
import { UserController } from "./presentation/user.controller";
import { GetUserRoleUseCase } from "@user/application/use-cases";
import { PrismaUserRepository, LocalUserRepository } from "@user/infrastructure/persistence";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { RolesGuard } from "./presentation/guards";

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [
        GetUserRoleUseCase,
        {
            provide: 'IUserRepository',
            useFactory: (prismaService: PrismaService) => {
                const isLocal = process.env.AUTH_REPO === "local" || process.env.STORAGE_DRIVER === "local";
                return isLocal ? new LocalUserRepository() : new PrismaUserRepository(prismaService);
            },
            inject: [PrismaService],
        },
        RolesGuard,
    ],
    exports: [GetUserRoleUseCase, RolesGuard],
})
export class UserModule { }
