import { BadRequestException } from "@nestjs/common";

export class ClinicIdNotFoundException extends BadRequestException {
    constructor() {
        super("Clinic id not found");
    }
}