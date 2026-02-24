import { BadRequestException } from "@nestjs/common";

export class PetNameNotFoundException extends BadRequestException {
    constructor() {
        super("Pet name not found");
    }
}
