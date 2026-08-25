import { Module } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AppointmentController } from './presentation/appointment.controller';
import { PrismaAppointmentService } from './infrastructure/persistence/prisma-appointment.service';
import { PetModule } from '@pet/pet.module';
import { VeterinarianModule } from '@veterinarian/veterinarian.module';
import { PrismaModule } from '@/common/infrastructure/prisma.module';
import { PrismaPetService } from '@pet/infrastructure/persistence';
import { PrismaVeterinarianService } from '@veterinarian/infrastructure/persistence';

import {
    CreateAppointmentUseCase,
    GetAppointmentByIdUseCase,
    GetAppointmentsByUserUseCase,
    UpdateAppointmentStatusUseCase
} from './application/use-cases';

@Module({
    imports: [
        PrismaModule,
        PetModule,
        VeterinarianModule,
    ],
    providers: [
        CreateAppointmentUseCase,
        GetAppointmentByIdUseCase,
        GetAppointmentsByUserUseCase,
        UpdateAppointmentStatusUseCase,
        PrismaPetService,
        PrismaVeterinarianService,
        {
            provide: "IAppointmentRepository",
            useClass: PrismaAppointmentService
        },
        {
            provide: "IPetRepository",
            useClass: PrismaPetService
        },
        {
            provide: "IVeterinarianRepository",
            useClass: PrismaVeterinarianService
        },
        {
            provide: "IIdGenerator",
            useValue: randomUUID
        }
    ],
    controllers: [AppointmentController],
    exports: [
        CreateAppointmentUseCase,
        GetAppointmentByIdUseCase,
        GetAppointmentsByUserUseCase,
        UpdateAppointmentStatusUseCase
    ]
})
export class AppointmentModule { }
