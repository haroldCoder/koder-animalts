import { BadRequestException } from "@nestjs/common";

export class VeterinaryClinicNotFoundException extends BadRequestException {
    constructor() {
        super("Veterinary clinic not found");
    }
}