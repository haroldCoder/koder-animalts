import { PrismaService } from "@/common/infrastructure/db";
import { Injectable } from "@nestjs/common";
import { RegisterMedicalRecordDto } from "@medical-record/infrastructure/dto";
import { ResponseDto } from "@/common/domain/dto/response.dto";
import { PetIdNotFoundException, ServerErrorException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";
import { MedicalRecordNotFoundException, MedicalRecordReasonForVisitNotFoundException, MedicalRecordTypeNotFoundException, MedicalRecordVisitDateNotFoundException } from "@medical-record/domain/exceptions";
import { MedicalRecordType } from "@medical-record/domain/enums";
import { PrismaPetService } from "@pet/infrastructure/persistence";
import { PrismaVeterinarianService } from "@veterinarian/infrastructure/persistence";
import { DocumentService } from "@document/infrastructure/document.service";
import { RegisterDocumentDto } from "@document/infrastructure/dto";
import { DocumentIdNotFoundException } from "@document/domain/exceptions";
import { MedicalRecordEntity } from "@medical-record/domain/entities";
import { sleep } from "@/common/infrastructure/utils/sleep.util";
import { PrismaVaccinationService } from "@vaccination/infrastructure/persistence";

@Injectable()
export class MedicalRecordService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly petService: PrismaPetService,
        private readonly veterinarianService: PrismaVeterinarianService,
        private readonly documentService: DocumentService,
        private readonly vaccinationService: PrismaVaccinationService,
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

            await this.petService.findById(petId);

            await this.veterinarianService.findByIdWithDetails(veterinarianId);

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

    async getMedicalRecordById(medicalRecordId: string): Promise<ResponseDto<MedicalRecordEntity>> {
        try {
            if (!medicalRecordId) {
                throw new MedicalRecordVisitDateNotFoundException()
            }

            const medicalRecord = await this.prisma.medicalRecord.findUnique({
                where: { id: medicalRecordId },
                include: {
                    vaccinations: true,
                },
            });

            if (!medicalRecord) {
                throw new MedicalRecordNotFoundException()
            }

            return {
                statusCode: 200,
                data: {
                    ...medicalRecord,
                    type: medicalRecord.type as MedicalRecordType,
                    diagnosis: medicalRecord.diagnosis || "",
                    treatment: medicalRecord.treatment || "",
                    notes: medicalRecord.notes || "",
                },
            };
        } catch (error) {
            if (error.status && error.status !== 500) {
                throw error;
            }
            throw new ServerErrorException("Failed to retrieve medical record");
        }
    }

    async uploadDocumentOfMedicalRecord(medicalRecordId: string, documents: RegisterDocumentDto[]): Promise<ResponseDto<string>> {
        try {
            if (!medicalRecordId) {
                throw new MedicalRecordVisitDateNotFoundException()
            }

            if (!documents) {
                throw new DocumentIdNotFoundException()
            }

            const medicalRecord = await this.getMedicalRecordById(medicalRecordId);

            if (!medicalRecord) {
                throw new MedicalRecordNotFoundException()
            }

            let veterinaryClinic: { id: string, name: string } | null = null;

            if (medicalRecord?.data?.veterinarianId) {
                veterinaryClinic = await this.veterinarianService.findClinicByVeterinarianId(medicalRecord?.data?.veterinarianId!);
            }

            for (const document of documents) {
                await this.documentService.registerDocument({
                    ...document,
                    medicalRecordId,
                    petId: medicalRecord?.data?.petId,
                    ...(veterinaryClinic && { clinicId: veterinaryClinic!.id }),
                });
                await sleep(500);
            }

            return {
                statusCode: 201,
                message: `${documents.length} document${documents.length === 1 ? '' : 's'} uploaded successfully`,
            };
        } catch (error) {
            if (error.status && error.status !== 500) {
                throw error;
            }
            throw new ServerErrorException("Failed to upload document");
        }
    }
}