import { Module } from '@nestjs/common';
import { PrismaModule } from '@/common/infrastructure/prisma.module';
import { VaccinationController } from '@vaccination/presentation';
import {
    RegisterVaccinationUseCase,
    GetUpcomingVaccinationsByPetUseCase,
    GetNextVaccinationReminderUseCase,
} from '@vaccination/application/use-cases';
import { PrismaVaccinationService } from '@vaccination/infrastructure/persistence';

@Module({
    imports: [PrismaModule],
    controllers: [VaccinationController],
    providers: [
        RegisterVaccinationUseCase,
        GetUpcomingVaccinationsByPetUseCase,
        GetNextVaccinationReminderUseCase,
        {
            provide: "IVaccinationRepository",
            useClass: PrismaVaccinationService,
        },
    ],
    exports: [
        RegisterVaccinationUseCase,
        GetUpcomingVaccinationsByPetUseCase,
        GetNextVaccinationReminderUseCase,
    ],
})
export class VaccinationModule { }

