import { BadRequestException } from "@nestjs/common";

export class MedicalRecordTypeNotFoundException extends BadRequestException {
    constructor() {
        super("Medical record type not found");
    }
}
