import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IPetRepository } from "@pet/domain/ports";
import { PetBackgroundEntity } from "@pet/domain/entities";
import { UpsertPetBackgroundDto } from "@pet/presentation/dtos";
import { ResponseDto } from "@/common/domain/dto";
import { PetIdNotFoundException, PetIdNotExistException, ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { PetBackgroundAccessDeniedException } from "@pet/domain/exceptions";

@Injectable()
export class UpsertPetBackgroundUseCase {
    constructor(
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository,
        @Inject("IIdGenerator")
        private readonly idGenerator: () => string
    ) { }

    private parseDate(val: any): Date | null {
        if (!val || val === "") return null;
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
    }

    async execute(
        petId: string,
        dto: UpsertPetBackgroundDto,
        userId?: string
    ): Promise<ResponseDto<any>> {
        try {
            const finalPetId = petId || dto?.petId;
            if (!finalPetId) throw new PetIdNotFoundException();

            const effectiveUserId = userId || dto?.userId;
            if (effectiveUserId) {
                const hasAccess = await this.petRepository.validateUserAccessToPet(effectiveUserId, finalPetId);
                if (!hasAccess) {
                    throw new PetBackgroundAccessDeniedException();
                }
            }

            const dietType = dto.dietType ?? dto.diet ?? null;
            const neuteredDate = this.parseDate(dto.neuteredDate);
            const lastVaccinationDate = this.parseDate(dto.lastVaccinationDate);
            const lastDewormingInternal =
                this.parseDate(dto.lastDewormingInternal) ??
                this.parseDate(dto.deworming?.lastInternalDewormingDate);
            const lastDewormingExternal =
                this.parseDate(dto.lastDewormingExternal) ??
                this.parseDate(dto.deworming?.lastExternalDewormingDate);
            const otherPreventiveNotes = dto.otherPreventiveNotes ?? dto.otherVaccinesNotes ?? null;

            let coreVaccines = dto.coreVaccines;
            if (!coreVaccines && (dto.canineVaccines || dto.felineVaccines || dto.deworming)) {
                coreVaccines = {
                    canineVaccines: dto.canineVaccines ?? null,
                    felineVaccines: dto.felineVaccines ?? null,
                    deworming: dto.deworming ?? null,
                };
            }

            const existingBackground = await this.petRepository.findBackgroundByPetId(finalPetId);

            let entityToSave: PetBackgroundEntity;

            if (existingBackground) {
                existingBackground.updateDetails({
                    provenance: dto.provenance,
                    dietType,
                    dietDetails: dto.dietDetails,
                    isNeutered: dto.isNeutered,
                    neuteredDate,
                    previousIllnesses: dto.previousIllnesses,
                    hasAllergies: dto.hasAllergies,
                    allergiesDescription: dto.allergiesDescription,
                    lastVaccinationDate,
                    coreVaccines,
                    lastDewormingInternal,
                    lastDewormingExternal,
                    otherPreventiveNotes,
                });
                entityToSave = existingBackground;
            } else {
                entityToSave = PetBackgroundEntity.create({
                    id: this.idGenerator(),
                    petId: finalPetId,
                    provenance: dto.provenance,
                    dietType,
                    dietDetails: dto.dietDetails,
                    isNeutered: dto.isNeutered,
                    neuteredDate,
                    previousIllnesses: dto.previousIllnesses,
                    hasAllergies: dto.hasAllergies,
                    allergiesDescription: dto.allergiesDescription,
                    lastVaccinationDate,
                    coreVaccines,
                    lastDewormingInternal,
                    lastDewormingExternal,
                    otherPreventiveNotes,
                });
            }

            const savedBackground = await this.petRepository.upsertBackground(entityToSave);

            return {
                statusCode: HttpStatus.OK,
                message: existingBackground
                    ? "Pet background updated successfully"
                    : "Pet background created successfully",
                data: savedBackground.toPrimitives(),
            };
        } catch (error) {
            if (
                error instanceof PetIdNotFoundException ||
                error instanceof PetIdNotExistException ||
                error instanceof UserIdNotFoundException ||
                error instanceof PetBackgroundAccessDeniedException
            ) {
                throw error;
            }
            throw new ServerErrorException("Failed to upsert pet background: " + error);
        }
    }
}
