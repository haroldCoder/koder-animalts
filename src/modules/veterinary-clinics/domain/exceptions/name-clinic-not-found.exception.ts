import { BadRequestException } from "@nestjs/common";

export class NameClinicNotFoundException extends BadRequestException {
    constructor() {
        super("El nombre de la clínica es requerido");
    }
}