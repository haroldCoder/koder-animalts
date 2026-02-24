import { BadRequestException } from "@nestjs/common";

export class PetClinicIdNotFoundException extends BadRequestException {
    constructor() {
        super("Pet clinic ID not found");
    }
}
