import { Module } from "@nestjs/common";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { PetController } from "@pet/presentation";
import {
    RegisterPetUseCase,
    UpdatePetUseCase,
    DeletePetUseCase,
    GetPetByIdUseCase,
    GetPetByVeterinarianIdUseCase,
    GetPetByOwnerIdUseCase
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
        GetPetByOwnerIdUseCase
    ]
})
export class PetModule { }