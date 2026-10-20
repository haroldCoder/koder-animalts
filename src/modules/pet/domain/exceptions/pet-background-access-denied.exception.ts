import { ForbiddenException } from "@nestjs/common";

export class PetBackgroundAccessDeniedException extends ForbiddenException {
    constructor(message = "User is not authorized to access this pet's background") {
        super(message);
    }
}
