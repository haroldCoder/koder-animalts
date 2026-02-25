import { PrismaService } from "@/common/infrastructure/db";
import { Injectable } from "@nestjs/common";
import { RegisterMedicalRecordDto } from "@medical-record/infrastructure/dto";
import { ResponseDto } from "@/common/domain/dto/response.dto";
import { PetIdNotFoundException, ServerErrorException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";
import { MedicalRecordReasonForVisitNotFoundException, MedicalRecordTypeNotFoundException, MedicalRecordVisitDateNotFoundException } from "@medical-record/domain/exceptions";
import { MedicalRecordType } from "@medical-record/domain/enums";
import { PetService } from "@pet/infrastructure";
import { VeterinarianService } from "@veterinarian/infrastructure";

@Injectable()
export class MedicalRecordService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly petService: PetService,
        private readonly veterinarianService: VeterinarianService,
    ) { }

    async createMedicalRecord(medicalRecord: RegisterMedicalRecordDto): Promise<ResponseDto<string>> {
        try {
            const { petId, veterinarianId, type, reasonForVisit, visitDate } = medicalRecord;

            if (!petId) {
                throw new PetIdNotFoundException()
            }

            if (!veterinarianId) {
                throw new VeterinarianIdNotFoundException()
            }

            if (!type) {
                throw new MedicalRecordTypeNotFoundException()
            }

            if (!reasonForVisit) {
                throw new MedicalRecordReasonForVisitNotFoundException()
            }

            if (!visitDate) {
                throw new MedicalRecordVisitDateNotFoundException()
            }

            await this.petService.getPetById(petId);

            await this.veterinarianService.getVeterinarianById(veterinarianId);

            await this.prisma.medicalRecord.create({
                data: { ...medicalRecord, type: medicalRecord.type as MedicalRecordType },
            });

            return {
                statusCode: 201,
                message: 'Medical record created successfully',
            };
        } catch (error) {
            if (error.status && error.status !== 500) {
                throw error;
            }
            throw new ServerErrorException("Failed to create medical record");
        }
    }
}