import { Module } from "@nestjs/common";
import { VeterinaryClinicsController, VeterinaryClinicsService } from "@veterinary-clinics/infrastructure";
import { PrismaModule } from "@/common/infrastructure/prisma.module";


@Module({
    imports: [PrismaModule],
    controllers: [VeterinaryClinicsController],
    providers: [VeterinaryClinicsService],
})
export class VeterinaryClinicsModule { }