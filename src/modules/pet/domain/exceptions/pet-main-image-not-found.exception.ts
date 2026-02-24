import { BadRequestException } from "@nestjs/common";

export class PetMainImageNotFoundException extends BadRequestException {
    constructor() {
        super("Pet main image not found");
    }
}
