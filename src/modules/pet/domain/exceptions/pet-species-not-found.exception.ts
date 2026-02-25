import { BadRequestException } from "@nestjs/common";

export class PetSpeciesNotFoundException extends BadRequestException {
    constructor() {
        super("Pet species not found");
    }
}
