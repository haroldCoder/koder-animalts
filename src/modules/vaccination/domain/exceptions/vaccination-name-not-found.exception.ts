import { BadRequestException } from "@nestjs/common";

export class VaccinationNameNotFoundException extends BadRequestException {
    constructor() {
        super("Vaccination name is required");
    }
}
