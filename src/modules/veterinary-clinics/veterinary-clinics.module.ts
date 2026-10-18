import { Module } from "@nestjs/common";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { VeterinaryClinicsController } from "@veterinary-clinics/presentation";
import {
    CreateVeterinaryClinicUseCase,
    FindAllVeterinaryClinicsUseCase,
    GetVeterinaryClinicSummaryUseCase,
} from "@veterinary-clinics/application/use-cases";
import { PrismaVeterinaryClinicService, LocalVeterinaryClinicService } from "@veterinary-clinics/infrastructure/persistence";
import { randomUUID } from "crypto";
import { GetAllVeterinarianOfClinicUseCase } from "./application/use-cases/get-all-veterinarian-of-clinic.use-case";

@Module({
    imports: [PrismaModule],
    controllers: [VeterinaryClinicsController],
    providers: [
        CreateVeterinaryClinicUseCase,
        FindAllVeterinaryClinicsUseCase,
        GetVeterinaryClinicSummaryUseCase,
        GetAllVeterinarianOfClinicUseCase,
        {
            provide: "IVeterinaryClinicRepository",
            useFactory: (prismaService: PrismaService) => {
                const isLocal = process.env.AUTH_REPO === "local" || process.env.STORAGE_DRIVER === "local";
                return isLocal ? new LocalVeterinaryClinicService() : new PrismaVeterinaryClinicService(prismaService);
            },
            inject: [PrismaService],
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
        GetAllVeterinarianOfClinicUseCase,
    ],
})
export class VeterinaryClinicsModule { }