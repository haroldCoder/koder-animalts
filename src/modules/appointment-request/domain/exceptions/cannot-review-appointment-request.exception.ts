import { ForbiddenException } from "@nestjs/common";

export class CannotReviewAppointmentRequestException extends ForbiddenException {
    constructor(message: string = "Cannot review this appointment request") {
        super(message);
    }
}
