import { Module } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaModule } from '@/common/infrastructure/prisma.module';
import { VaccinationController } from '@vaccination/presentation';
import {
    RegisterVaccinationUseCase,
    GetUpcomingVaccinationsByPetUseCase,
    GetNextVaccinationReminderUseCase,
    FindVaccinationsByUserIdUseCase,
} from '@vaccination/application/use-cases';
import { PrismaVaccinationService } from '@vaccination/infrastructure/persistence';

@Module({
    imports: [PrismaModule],
    controllers: [VaccinationController],
    providers: [
        RegisterVaccinationUseCase,
        GetUpcomingVaccinationsByPetUseCase,
        GetNextVaccinationReminderUseCase,
        FindVaccinationsByUserIdUseCase,
        {
            provide: "IVaccinationRepository",
            useClass: PrismaVaccinationService,
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
    ],
})
export class VaccinationModule { }

