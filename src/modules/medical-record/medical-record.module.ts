import { Module } from '@nestjs/common';
import { MedicalRecordService } from './infrastructure/medical-record.service';
import { MedicalRecordController } from './infrastructure/medical-record.controller';
import { PetService } from '@pet/infrastructure/pet.service';
import { VeterinarianService } from '@veterinarian/infrastructure/veterinarian.service';
import { DocumentService } from '@document/infrastructure';

@Module({
    providers: [MedicalRecordService, PetService, VeterinarianService, DocumentService],
    controllers: [MedicalRecordController],
})
export class MedicalRecordModule { }
