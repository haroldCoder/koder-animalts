import { Module } from '@nestjs/common';
import { PrismaModule } from '@/common/infrastructure/prisma.module';
import { AppointmentRequestController } from './presentation/controllers';
import {
    CreateAppointmentRequestUseCase,
    ApproveAppointmentRequestUseCase,
    RejectAppointmentRequestUseCase,
} from './application/use-cases';
import { PrismaAppointmentRequestRepository } from './infrastructure/persistance';
import { PrismaAppointmentService } from '@appointment/infrastructure/persistence/prisma-appointment.service';
import { PrismaVeterinaryClinicService } from '@veterinary-clinics/infrastructure/persistence';
import { TransactionManager } from '@/common/domain/ports';
import { PrismaTransactionManager } from '@/common/infrastructure/db';
import { randomUUID } from 'crypto';
import { PrismaVeterinarianService } from '@veterinarian/infrastructure';
import { FindAppointmentsRequestUseCase } from './application/use-cases/find-appointments-request.use-case';
@Module({
    imports: [PrismaModule],
    controllers: [AppointmentRequestController],
    providers: [
        CreateAppointmentRequestUseCase,
        ApproveAppointmentRequestUseCase,
        RejectAppointmentRequestUseCase,
        FindAppointmentsRequestUseCase,
        {
            provide: 'IAppointmentRequestRepository',
            useClass: PrismaAppointmentRequestRepository,
        },
        {
            provide: 'IAppointmentRepository',
            useClass: PrismaAppointmentService,
        },
        {
            provide: 'IVeterinaryClinicRepository',
            useClass: PrismaVeterinaryClinicService,
        },
        {
            provide: 'IVeterinarianRepository',
            useClass: PrismaVeterinarianService
        },
        {
            provide: TransactionManager,
            useClass: PrismaTransactionManager,
        },
        {
            provide: 'IIdGenerator',
            useValue: randomUUID,
        },
    ],
    exports: [
        CreateAppointmentRequestUseCase,
        ApproveAppointmentRequestUseCase,
        RejectAppointmentRequestUseCase,
        FindAppointmentsRequestUseCase,
    ],
})
export class AppointmentRequestModule { }