import { BadRequestException } from "@nestjs/common";

export class PetIdNotExistException extends BadRequestException {
    constructor() {
        super('Pet not exist');
    }
}