import { BadRequestException } from "@nestjs/common";

export class MedicalRecordVisitDateNotFoundException extends BadRequestException {
    constructor() {
        super("Medical record visit date not found");
    }
}
