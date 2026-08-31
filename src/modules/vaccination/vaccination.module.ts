import { Module } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaModule } from '@/common/infrastructure/prisma.module';
import { VaccinationController } from '@vaccination/presentation';
import {
    RegisterVaccinationUseCase,
    GetUpcomingVaccinationsByPetUseCase,
    GetNextVaccinationReminderUseCase,
    FindVaccinationsByUserIdUseCase,
    UpdateStatusVaccinationUseCase,
    GetVaccinationByIdUseCase,
} from '@vaccination/application/use-cases';
import { PrismaVaccinationService } from '@vaccination/infrastructure/persistence';
import { PrismaVeterinarianService } from '@veterinarian/infrastructure';

@Module({
    imports: [PrismaModule],
    controllers: [VaccinationController],
    providers: [
        RegisterVaccinationUseCase,
        GetUpcomingVaccinationsByPetUseCase,
        GetNextVaccinationReminderUseCase,
        FindVaccinationsByUserIdUseCase,
        UpdateStatusVaccinationUseCase,
        GetVaccinationByIdUseCase,
        {
            provide: "IVaccinationRepository",
            useClass: PrismaVaccinationService,
        },
        {
            provide: "IVeterinarianRepository",
            useClass: PrismaVeterinarianService
        },
        {
            provide: "IIdGenerator",
            useValue: randomUUID,
        },
    ],
    exports: [
        RegisterVaccinationUseCase,
        GetUpcomingVaccinationsByPetUseCase,
        GetNextVaccinationReminderUseCase,
        FindVaccinationsByUserIdUseCase,
        UpdateStatusVaccinationUseCase,
        GetVaccinationByIdUseCase,
    ],
})
export class VaccinationModule { }

