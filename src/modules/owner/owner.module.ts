import { Module } from "@nestjs/common";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { OwnerService } from "@owner/infrastructure";
import { OwnerController } from "@owner/infrastructure";

@Module({
    imports: [PrismaModule],
    providers: [OwnerService],
    controllers: [OwnerController],
})

export class OwnerModule { }