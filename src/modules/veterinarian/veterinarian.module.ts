import { Module } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { VeterinarianController } from "@veterinarian/presentation";
import {
    CreateVeterinarianUseCase,
    FindClinicOfVeterinarianUseCase,
    GetVeterinarianByIdUseCase,
    FindVeterinarianByUserIdUseCase,
} from "@veterinarian/application/use-cases";
import { PrismaVeterinarianService, LocalVeterinarianService } from "@veterinarian/infrastructure";

@Module({
    imports: [PrismaModule],
    controllers: [VeterinarianController],
    providers: [
        CreateVeterinarianUseCase,
        FindClinicOfVeterinarianUseCase,
        GetVeterinarianByIdUseCase,
        FindVeterinarianByUserIdUseCase,
        {
            provide: "IVeterinarianRepository",
            useFactory: (prismaService: PrismaService) => {
                const isLocal = process.env.AUTH_REPO === "local" || process.env.STORAGE_DRIVER === "local";
                return isLocal ? new LocalVeterinarianService() : new PrismaVeterinarianService(prismaService);
            },
            inject: [PrismaService],
        },
        {
            provide: "IIdGenerator",
            useValue: randomUUID,
        },
    ],
    exports: [
        CreateVeterinarianUseCase,
        FindClinicOfVeterinarianUseCase,
        GetVeterinarianByIdUseCase,
        FindVeterinarianByUserIdUseCase,
    ],
})
export class VeterinarianModule { }