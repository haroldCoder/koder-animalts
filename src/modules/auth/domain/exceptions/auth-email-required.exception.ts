import { BadRequestException } from "@nestjs/common";

export class AuthEmailRequiredException extends BadRequestException {
    constructor() {
        super("Auth email is required");
    }
}
