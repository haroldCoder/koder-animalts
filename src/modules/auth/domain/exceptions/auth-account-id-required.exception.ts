import { BadRequestException } from "@nestjs/common";

export class AuthAccountIdRequiredException extends BadRequestException {
    constructor() {
        super("Auth account ID is required");
    }
}
