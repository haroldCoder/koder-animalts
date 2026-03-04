import { HttpException, HttpStatus } from "@nestjs/common";

export class OwnerAlreadyExistException extends HttpException {
    constructor() {
        super("Owner already exist", HttpStatus.BAD_REQUEST);
    }
}