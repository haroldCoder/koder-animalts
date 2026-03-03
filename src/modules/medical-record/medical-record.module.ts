import { Module } from '@nestjs/common';
import { MedicalRecordService } from './infrastructure/medical-record.service';
import { MedicalRecordController } from './infrastructure/medical-record.controller';
import { PrismaPetService } from '@pet/infrastructure/persistence';
import { PrismaVeterinarianService } from '@veterinarian/infrastructure/persistence';
import { DocumentService } from '@document/infrastructure/document.service';
import { PrismaVaccinationService } from '@vaccination/infrastructure/persistence';

@Module({
    providers: [MedicalRecordService, PrismaPetService, PrismaVeterinarianService, DocumentService, PrismaVaccinationService],
    controllers: [MedicalRecordController],
})
export class MedicalRecordModule { }
