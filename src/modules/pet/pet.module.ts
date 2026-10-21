import { Module } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { PetController } from "@pet/presentation";
import {
    RegisterPetUseCase,
    UpdatePetUseCase,
    DeletePetUseCase,
    GetPetByIdUseCase,
    GetPetByVeterinarianIdUseCase,
    GetPetByOwnerIdUseCase,
    GetPetByUserOwnerUseCase,
    GetPetByVeterinarianUserIdUseCase,
    UpdateClinicUseCase,
    GetPetBackgroundUseCase,
    UpsertPetBackgroundUseCase
} from "@pet/application/use-cases";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { PrismaPetService, LocalPetService } from "@pet/infrastructure/persistence";
import { PrismaVeterinarianService } from "@veterinarian/infrastructure/persistence";
import { PrismaAppointmentService } from "@appointment/infrastructure";

@Module({
    imports: [PrismaModule],
    controllers: [PetController],
    providers: [
        RegisterPetUseCase,
        UpdatePetUseCase,
        DeletePetUseCase,
        GetPetByIdUseCase,
        GetPetByVeterinarianIdUseCase,
        GetPetByOwnerIdUseCase,
        GetPetByUserOwnerUseCase,
        GetPetByVeterinarianUserIdUseCase,
        PrismaVeterinarianService,
        UpdateClinicUseCase,
        GetPetBackgroundUseCase,
        UpsertPetBackgroundUseCase,
        LocalPetService,
        PrismaPetService,
        {
            provide: "IPetRepository",
            useFactory: (prismaService: PrismaService, veterinarianService: PrismaVeterinarianService) => {
                const isLocal = process.env.AUTH_REPO === "local" || process.env.STORAGE_DRIVER === "local" || process.env.PET_REPO === "local";
                return isLocal ? new LocalPetService() : new PrismaPetService(prismaService, veterinarianService);
            },
            inject: [PrismaService, PrismaVeterinarianService],
        },
        {
            provide: "IAppointmentRepository",
            useClass: PrismaAppointmentService
        },
        {
            provide: "IIdGenerator",
            useValue: randomUUID
        }
    ],
    exports: [
        RegisterPetUseCase,
        UpdatePetUseCase,
        DeletePetUseCase,
        GetPetByIdUseCase,
        GetPetByVeterinarianIdUseCase,
        GetPetByOwnerIdUseCase,
        GetPetByUserOwnerUseCase,
        GetPetByVeterinarianUserIdUseCase,
        UpdateClinicUseCase,
        GetPetBackgroundUseCase,
        UpsertPetBackgroundUseCase
    ]
})
export class PetModule { }