import { BadRequestException } from "@nestjs/common";

export class MedicalRecordNotFoundException extends BadRequestException {
    constructor() {
        super('Medical record not found');
    }
}