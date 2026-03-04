import { BadRequestException } from "@nestjs/common";

export class MedicalRecordIdNotFoundException extends BadRequestException {
    constructor() {
        super("Medical record id not found");
    }
}