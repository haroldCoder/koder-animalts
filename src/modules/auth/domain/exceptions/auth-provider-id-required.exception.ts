import { BadRequestException } from "@nestjs/common";

export class AuthProviderIdRequiredException extends BadRequestException {
    constructor() {
        super("Auth provider ID is required");
    }
}
