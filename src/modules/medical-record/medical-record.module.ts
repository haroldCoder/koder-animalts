import { Module } from '@nestjs/common';
import { MedicalRecordController } from '@medical-record/presentation/medical-record.controller';
import { PrismaMedicalRecordService } from '@medical-record/infrastructure';
import { PetModule } from '@pet/pet.module';
import { VeterinarianModule } from '@veterinarian/veterinarian.module';
import { DocumentModule } from '@document/document.module';
import { VaccinationModule } from '@vaccination/vaccination.module';
import { PrismaModule } from '@/common/infrastructure/prisma.module';
import { PrismaPetService } from '@pet/infrastructure/persistence';

import {
    CreateMedicalRecordUseCase,
    GetMedicalRecordByIdUseCase,
    GetMedicalRecordByPetIdUseCase,
    GetMedicalRecordByVeterinarianIdUseCase,
    UploadDocumentToMedicalRecordUseCase
} from '@medical-record/application/use-cases';
import { PrismaVeterinarianService } from '@veterinarian/infrastructure/persistence';

@Module({
    imports: [
        PrismaModule,
        PetModule,
        VeterinarianModule,
        DocumentModule,
        VaccinationModule,
    ],
    providers: [
        CreateMedicalRecordUseCase,
        GetMedicalRecordByIdUseCase,
        UploadDocumentToMedicalRecordUseCase,
        GetMedicalRecordByVeterinarianIdUseCase,
        GetMedicalRecordByPetIdUseCase,
        PrismaVeterinarianService,
        {
            provide: "MedicalRecordRepository",
            useClass: PrismaMedicalRecordService
        },
        {
            provide: "IPetRepository",
            useClass: PrismaPetService
        },
        {
            provide: "IVeterinarianRepository",
            useClass: PrismaVeterinarianService
        }
    ],
    controllers: [MedicalRecordController],
    exports: [
        CreateMedicalRecordUseCase,
        GetMedicalRecordByIdUseCase,
        UploadDocumentToMedicalRecordUseCase,
        GetMedicalRecordByVeterinarianIdUseCase,
        GetMedicalRecordByPetIdUseCase
    ]
})
export class MedicalRecordModule { }
