import { BadRequestException, NotFoundException } from "@nestjs/common";

export class VeterinarianIdNotExistException extends NotFoundException {
    constructor() {
        super("Veterinarian not exist");
    }
}