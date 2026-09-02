import { BadRequestException } from "@nestjs/common";

export class VaccinationDatesConflictTimeException extends BadRequestException {
    constructor() {
        super('The dateAdministered is after than nextDueDate. Please select a valid date');
        this.name = 'VaccinationDatesConflictTimeException';
    }
}