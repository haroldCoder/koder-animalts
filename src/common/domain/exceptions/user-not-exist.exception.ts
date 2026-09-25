import { BadRequestException } from "@nestjs/common";

export class UserNotExistException extends BadRequestException {
    constructor() {
        super('this user not exist');
    }
}