import { BadRequestException } from "@nestjs/common";

export class MedicalRecordNotExistException extends BadRequestException {
    constructor() {
        super("Medical record not exist");
    }
}