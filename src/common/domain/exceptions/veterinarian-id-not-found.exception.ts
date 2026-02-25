import { BadRequestException } from "@nestjs/common";

export class VeterinarianIdNotFoundException extends BadRequestException {
    constructor() {
        super("Veterinarian not found");
    }
}