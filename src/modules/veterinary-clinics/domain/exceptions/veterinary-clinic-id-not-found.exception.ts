import { BadRequestException } from "@nestjs/common";

export class VeterinaryClinicIdNotFoundException extends BadRequestException {
    constructor() {
        super(`Clinic id not found`);
    }
}
