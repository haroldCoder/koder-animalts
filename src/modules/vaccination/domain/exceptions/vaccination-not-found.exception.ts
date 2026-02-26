import { BadRequestException } from "@nestjs/common";

export class VaccinationNotFoundException extends BadRequestException {
    constructor() {
        super('Vaccination not found');
    }
}
