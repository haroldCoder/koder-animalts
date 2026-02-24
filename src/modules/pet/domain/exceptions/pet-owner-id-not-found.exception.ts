import { BadRequestException } from "@nestjs/common";

export class PetOwnerIdNotFoundException extends BadRequestException {
    constructor() {
        super("Pet owner ID not found");
    }
}
