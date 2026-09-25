import { ForbiddenException } from "@nestjs/common";

export class CannotCancelAppointmentRequestException extends ForbiddenException {
    constructor(message: string = "Cannot cancel this appointment request") {
        super(message);
    }
}
