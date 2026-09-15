import { BadRequestException } from "@nestjs/common";

export class ClinicNotExistException extends BadRequestException {
    constructor(clinicId: string) {
        super(`The clinic in charge with id ${clinicId} not exist`);
    }
}
