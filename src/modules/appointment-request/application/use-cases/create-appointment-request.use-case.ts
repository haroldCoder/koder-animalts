import { Injectable } from "@nestjs/common";
import type { IAppointmentRequestRepository } from "../../domain/ports";
import { CreateAppointmentRequestDto } from "../../domain/dtos/create-appointment-request.dto";

@Injectable()
export class CreateAppointmentRequestUseCase {
    constructor(private readonly repo: IAppointmentRequestRepository) { }

    async execute(ownerId: string, dto: CreateAppointmentRequestDto) {
        return this.repo.create({ ...dto, ownerId });
    }
}