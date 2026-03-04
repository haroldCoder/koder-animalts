import { Module } from "@nestjs/common";
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
        }
    ],
    exports: [CreateOwnerUseCase, FindOwnerByUserIdUseCase]
})
export class OwnerModule { }