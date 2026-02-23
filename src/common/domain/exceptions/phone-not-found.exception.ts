import { BadRequestException } from "@nestjs/common";

export class PhoneNotFoundException extends BadRequestException {
    constructor() {
        super("Phone not found");
    }
}