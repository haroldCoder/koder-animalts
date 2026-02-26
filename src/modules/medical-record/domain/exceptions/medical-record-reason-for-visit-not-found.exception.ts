import { BadRequestException } from "@nestjs/common";

export class MedicalRecordReasonForVisitNotFoundException extends BadRequestException {
    constructor() {
        super("Medical record reason for visit not found");
    }
}
