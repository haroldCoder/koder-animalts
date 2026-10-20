import { BadRequestException } from "@nestjs/common";

export class PetBackgroundIdNotFoundException extends BadRequestException {
    constructor() {
        super("Pet background ID not found");
    }
}
