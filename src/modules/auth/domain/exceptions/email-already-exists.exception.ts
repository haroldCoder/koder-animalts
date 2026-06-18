import { BadRequestException } from "@nestjs/common";

export class EmailAlreadyExistsException extends BadRequestException {
    constructor() {
        super("El correo electrónico ya está registrado");
    }
}
