import { Module } from "@nestjs/common";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { VeterinarianService } from "@veterinarian/infrastructure";
import { VeterinarianController } from "@veterinarian/infrastructure";

@Module({
    imports: [PrismaModule],
    providers: [VeterinarianService],
    controllers: [VeterinarianController],
})
export class VeterinarianModule { }