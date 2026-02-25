import { BadRequestException } from "@nestjs/common";

export class PetIdNotFoundException extends BadRequestException {
    constructor() {
        super("Pet ID not found");
    }
}