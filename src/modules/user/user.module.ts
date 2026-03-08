import { Module } from "@nestjs/common";
import { UserController } from "./presentation/user.controller";
import { GetUserRoleUseCase } from "@user/application/use-cases";
import { PrismaUserRepository } from "@user/infrastructure/persistence";
import { PrismaModule } from "@/common/infrastructure/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [
        GetUserRoleUseCase,
        {
            provide: 'IUserRepository',
            useClass: PrismaUserRepository,
        },
    ],
    exports: [GetUserRoleUseCase],
})
export class UserModule { }
