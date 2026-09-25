import { ForbiddenException } from "@nestjs/common";

export class CannotRejectAppointmentRequestException extends ForbiddenException {
    constructor(message: string = "Cannot reject this appointment request") {
        super(message);
    }
}
