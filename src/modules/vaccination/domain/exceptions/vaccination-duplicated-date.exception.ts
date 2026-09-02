import { BadRequestException } from "@nestjs/common";

export class VaccinationDuplicatedDateException extends BadRequestException {
    constructor() {
        super("Vaccination with the same date already exists");
        this.name = "VaccinationDuplicatedDateException";
    }
}
