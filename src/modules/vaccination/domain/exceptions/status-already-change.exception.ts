import { BadRequestException } from "@nestjs/common";

export class StatusAlreadyChangedException extends BadRequestException {
    constructor() {
        super('The status has already been changed');
    }
}