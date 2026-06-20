import { Module } from "@nestjs/common";
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
    GetPetByVeterinarianUserIdUseCase
} from "@pet/application/use-cases";
import { PrismaPetService } from "@pet/infrastructure/persistence";
import { PrismaVeterinarianService } from "@veterinarian/infrastructure/persistence";

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
        {
            provide: "IPetRepository",
            useClass: PrismaPetService
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
        GetPetByVeterinarianUserIdUseCase
    ]
})
export class PetModule { }