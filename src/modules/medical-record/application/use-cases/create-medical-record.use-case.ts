import { Inject, Injectable } from "@nestjs/common";
import { RegisterMedicalRecordDto } from "@medical-record/presentation/dtos";
import { ResponseDto } from "@/common/domain/dto/response.dto";
import { PetIdNotFoundException, ServerErrorException, VeterinarianIdNotFoundException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { MedicalRecordReasonForVisitNotFoundException, MedicalRecordTypeNotFoundException, MedicalRecordVisitDateNotFoundException } from "@medical-record/domain/exceptions";
import type { MedicalRecordRepository } from "@medical-record/domain/ports";
import { MedicalRecordType } from "@medical-record/domain/enums";
import { MedicalRecordEntity } from "@medical-record/domain/entities";
import type { IPetRepository } from "@pet/domain/ports";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";

@Injectable()
export class CreateMedicalRecordUseCase {
    constructor(
        @Inject("MedicalRecordRepository")
        private readonly medicalRecordRepository: MedicalRecordRepository,
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository,
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository,
        @Inject("IIdGenerator")
        private readonly generateId: () => string,
    ) { }

    async execute(medicalRecord: RegisterMedicalRecordDto): Promise<ResponseDto<string>> {
        try {
            const { petId, userId, type, reasonForVisit, visitDate } = medicalRecord;

            if (!petId) throw new PetIdNotFoundException();
            if (!userId) throw new UserIdNotFoundException();
            if (!type) throw new MedicalRecordTypeNotFoundException();
            if (!reasonForVisit) throw new MedicalRecordReasonForVisitNotFoundException();
            if (!visitDate) throw new MedicalRecordVisitDateNotFoundException();

            const pet = await this.petRepository.findById(petId);
            if (!pet) throw new PetIdNotFoundException();

            const veterinarian = await this.veterinarianRepository.findByUserId(userId);
            if (!veterinarian) throw new VeterinarianIdNotFoundException();

            const id = this.generateId();
            const entity = MedicalRecordEntity.create({
                id,
                visitDate,
                type: type as MedicalRecordType,
                reasonForVisit,
                diagnosis: medicalRecord.diagnosis,
                treatment: medicalRecord.treatment,
                notes: medicalRecord.notes,
                petId,
                veterinarianId: veterinarian.getId(),
                ownerId: pet.getOwnerId(),
                clinicId: pet.getClinicId(),
            });

            await this.medicalRecordRepository.create(entity);

            return {
                statusCode: 201,
                message: 'Medical record created successfully',
                data: id,
            };
        } catch (error) {
            if (
                error instanceof PetIdNotFoundException ||
                error instanceof UserIdNotFoundException ||
                error instanceof VeterinarianIdNotFoundException ||
                error instanceof MedicalRecordTypeNotFoundException ||
                error instanceof MedicalRecordReasonForVisitNotFoundException ||
                error instanceof MedicalRecordVisitDateNotFoundException
            ) throw error;
            throw new ServerErrorException("Failed to create medical record");
        }
    }
}
