import { Module } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { OwnerController } from "@owner/presentation";
import { CreateOwnerUseCase, FindOwnerByUserIdUseCase } from "@owner/application/use-cases";
import { PrismaOwnerService, LocalOwnerService } from "@owner/infrastructure";

@Module({
    imports: [PrismaModule],
    controllers: [OwnerController],
    providers: [
        CreateOwnerUseCase,
        FindOwnerByUserIdUseCase,
        {
            provide: "IOwnerRepository",
            useFactory: (prismaService: PrismaService) => {
                const isLocal = process.env.AUTH_REPO === "local" || process.env.STORAGE_DRIVER === "local";
                return isLocal ? new LocalOwnerService() : new PrismaOwnerService(prismaService);
            },
            inject: [PrismaService],
        },
        {
            provide: "IIdGenerator",
            useValue: randomUUID,
        },
    ],
    exports: [CreateOwnerUseCase, FindOwnerByUserIdUseCase],
})
export class OwnerModule { }