import { HttpException, HttpStatus } from "@nestjs/common";

export class VeterinarianAlreadyExistsException extends HttpException {
    constructor() {
        super("Veterinarian already exists for this user", HttpStatus.CONFLICT);
    }
}
