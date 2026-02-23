import { BadRequestException } from "@nestjs/common";

export class UserIdNotFoundException extends BadRequestException {
    constructor() {
        super("User id not found");
    }
}