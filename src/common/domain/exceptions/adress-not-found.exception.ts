import { BadRequestException } from "@nestjs/common";

export class AdressNotFoundException extends BadRequestException {
    constructor() {
        super("Adress not found");
    }
}