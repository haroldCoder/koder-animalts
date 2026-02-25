import { Module } from "@nestjs/common";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { PetController, PetService } from "@pet/infrastructure";

@Module({
    imports: [PrismaModule],
    controllers: [PetController],
    providers: [PetService],
    exports: [PetService]
})
export class PetModule { }