import { Module } from "@nestjs/common";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { VeterinaryClinicsController } from "@veterinary-clinics/presentation";
import {
    CreateVeterinaryClinicUseCase,
    FindAllVeterinaryClinicsUseCase,
    GetVeterinaryClinicSummaryUseCase,
} from "@veterinary-clinics/application/use-cases";
import { PrismaVeterinaryClinicService } from "@veterinary-clinics/infrastructure/persistence";
import { randomUUID } from "crypto";

@Module({
    imports: [PrismaModule],
    controllers: [VeterinaryClinicsController],
    providers: [
        CreateVeterinaryClinicUseCase,
        FindAllVeterinaryClinicsUseCase,
        GetVeterinaryClinicSummaryUseCase,
        {
            provide: "IVeterinaryClinicRepository",
            useClass: PrismaVeterinaryClinicService,
        },
        {
            provide: "IIdGenerator",
            useValue: randomUUID,
        },
    ],
    exports: [
        CreateVeterinaryClinicUseCase,
        FindAllVeterinaryClinicsUseCase,
        GetVeterinaryClinicSummaryUseCase,
    ],
})
export class VeterinaryClinicsModule { }