import { InternalServerErrorException } from "@nestjs/common";

export class ServerErrorException extends InternalServerErrorException {
    constructor(message: string) {
        super(message);
    }
}