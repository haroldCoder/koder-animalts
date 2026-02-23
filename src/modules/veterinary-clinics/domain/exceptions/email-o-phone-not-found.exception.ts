import { BadRequestException } from "@nestjs/common";

export class EmailOrPhoneNotFoundException extends BadRequestException {
    constructor() {
        super("El email o el teléfono es requerido");
    }
}