import { BadRequestException } from "@nestjs/common";

export class ClinicChangeNotAllowedByAppointmentException extends BadRequestException {
    constructor() {
        super("Clinic change is not allowed because there are appointments with the current clinic");
    }
}