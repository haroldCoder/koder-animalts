import { Inject, Injectable } from "@nestjs/common";
import { AppointmentEntity } from "../../domain/entities";
import type { IAppointmentRepository } from "../../domain/ports/appointment.repository";
import type { IPetRepository } from "@pet/domain/ports";
import type { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { PetIdNotFoundException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";
import { RegisterAppointmentDto } from "../../presentation/dtos";

@Injectable()
export class CreateAppointmentUseCase {
    constructor(
        @Inject("IAppointmentRepository")
        private readonly appointmentRepository: IAppointmentRepository,
        @Inject("IPetRepository")
        private readonly petRepository: IPetRepository,
        @Inject("IVeterinarianRepository")
        private readonly veterinarianRepository: IVeterinarianRepository,
        @Inject("IIdGenerator")
        private readonly idGenerator: () => string
    ) { }

    async execute(data: RegisterAppointmentDto): Promise<AppointmentEntity> {
        const pet = await this.petRepository.findById(data.petId);
        if (!pet) {
            throw new PetIdNotFoundException();
        }

        const veterinarian = await this.veterinarianRepository.findByUserId(data.userId);
        if (!veterinarian) {
            throw new VeterinarianIdNotFoundException();
        }

        const appointment = AppointmentEntity.create({
            id: this.idGenerator(),
            date: new Date(data.date),
            reason: data.reason,
            notes: data.notes,
            petId: data.petId,
            veterinarianId: veterinarian.getId(),
        });

        return this.appointmentRepository.create({
            ...data,
            date: new Date(data.date),
        });
    }
}
