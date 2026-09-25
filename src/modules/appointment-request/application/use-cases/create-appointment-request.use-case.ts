import { Inject, Injectable } from "@nestjs/common";
import type { IAppointmentRequestRepository } from "../../domain/ports";
import { CreateAppointmentRequestDto } from "../../domain/dtos/create-appointment-request.dto";

@Injectable()
export class CreateAppointmentRequestUseCase {
    constructor(
        @Inject("IAppointmentRequestRepository")
        private readonly repo: IAppointmentRequestRepository) { }

    async execute(dto: CreateAppointmentRequestDto, userId?: string): Promise<string> {
        const id = await this.repo.create({ ...dto, userId: userId ?? dto.userId });
        return id;
    }
}