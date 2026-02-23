import { Global, Module } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";

@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }