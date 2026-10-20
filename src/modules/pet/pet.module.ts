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
import { PrismaPetService } from "@pet/infrastructure/persistence";
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
        {
            provide: "IPetRepository",
            useClass: PrismaPetService
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