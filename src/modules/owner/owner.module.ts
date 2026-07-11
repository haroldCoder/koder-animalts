import { Module } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { OwnerController } from "@owner/presentation";
import { CreateOwnerUseCase, FindOwnerByUserIdUseCase } from "@owner/application/use-cases";
import { PrismaOwnerService } from "@owner/infrastructure";

@Module({
    imports: [PrismaModule],
    controllers: [OwnerController],
    providers: [
        CreateOwnerUseCase,
        FindOwnerByUserIdUseCase,
        {
            provide: "IOwnerRepository",
            useClass: PrismaOwnerService
        },
        {
            provide: "IIdGenerator",
            useValue: randomUUID
        }
    ],
    exports: [CreateOwnerUseCase, FindOwnerByUserIdUseCase]
})
export class OwnerModule { }