import { Module } from "@nestjs/common";
import { PrismaModule } from "@/common/infrastructure/prisma.module";
import { VeterinarianController } from "@veterinarian/presentation/veterinarian.controller";
import {
    CreateVeterinarianUseCase,
    FindClinicOfVeterinarianUseCase,
    GetVeterinarianByIdUseCase,
    FindVeterinarianByUserIdUseCase
} from "@veterinarian/application/use-cases";
import { PrismaVeterinarianService } from "@veterinarian/infrastructure/persistence/prisma-veterinarian.service";

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
            useClass: PrismaVeterinarianService
        }
    ],
    exports: [
        CreateVeterinarianUseCase,
        FindClinicOfVeterinarianUseCase,
        GetVeterinarianByIdUseCase,
        FindVeterinarianByUserIdUseCase
    ]
})
export class VeterinarianModule { }