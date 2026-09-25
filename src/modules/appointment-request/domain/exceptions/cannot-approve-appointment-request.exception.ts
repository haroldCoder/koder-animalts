import { ForbiddenException } from "@nestjs/common";

export class CannotApproveAppointmentRequestException extends ForbiddenException {
    constructor(message: string = "Cannot approve this appointment request") {
        super(message);
    }
}
