import { BadRequestException } from "@nestjs/common";

export class AppointmentRequestNotPendingException extends BadRequestException {
    constructor(message: string = "Appointment request is not pending") {
        super(message);
    }
}
