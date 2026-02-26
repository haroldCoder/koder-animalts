import { Module } from '@nestjs/common';
import { MedicalRecordService } from './infrastructure/medical-record.service';
import { MedicalRecordController } from './infrastructure/medical-record.controller';
import { PetService } from '@pet/infrastructure/pet.service';
import { VeterinarianService } from '@veterinarian/infrastructure/veterinarian.service';
import { DocumentService } from '@document/infrastructure';
import { VaccinationService } from '@vaccination/infrastructure/vaccination.service';

@Module({
    providers: [MedicalRecordService, PetService, VeterinarianService, DocumentService, VaccinationService],
    controllers: [MedicalRecordController],
})
export class MedicalRecordModule { }
