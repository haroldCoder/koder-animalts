import { Module } from "@nestjs/common";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { PetController } from "@pet/presentation";
import {
    RegisterPetUseCase,
    UpdatePetUseCase,
    DeletePetUseCase,
    GetPetByIdUseCase
} from "@pet/application/use-cases";
import { PrismaPetService } from "@pet/infrastructure/persistence";

@Module({
    imports: [PrismaModule],
    controllers: [PetController],
    providers: [
        RegisterPetUseCase,
        UpdatePetUseCase,
        DeletePetUseCase,
        GetPetByIdUseCase,
        {
            provide: "IPetRepository",
            useClass: PrismaPetService
        }
    ],
    exports: [
        RegisterPetUseCase,
        UpdatePetUseCase,
        DeletePetUseCase,
        GetPetByIdUseCase
    ]
})
export class PetModule { }