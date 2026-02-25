import { Body, Controller, Post } from "@nestjs/common";
import { MedicalRecordService } from "./medical-record.service";
import { RegisterMedicalRecordDto } from "@medical-record/infrastructure/dto";

@Controller('medical-record')
export class MedicalRecordController {
    constructor(private readonly medicalRecordService: MedicalRecordService) { }

    @Post()
    async createMedicalRecord(@Body() medicalRecord: RegisterMedicalRecordDto) {
        return this.medicalRecordService.createMedicalRecord(medicalRecord);
    }
}
