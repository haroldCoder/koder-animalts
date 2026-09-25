import { NotFoundException } from "@nestjs/common";

export class AppointmentRequestNotFoundException extends NotFoundException {
    constructor(id?: string) {
        super(id ? `Appointment request with id ${id} not found` : "Appointment request not found");
    }
}
