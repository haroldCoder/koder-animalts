import { Module } from "@nestjs/common";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { AuthController, LoginService } from "@auth/infrastructure";

@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers: [LoginService],
})
export class AuthModule { }
