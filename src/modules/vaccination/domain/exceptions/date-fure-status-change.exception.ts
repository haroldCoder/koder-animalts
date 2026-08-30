import { BadRequestException } from "@nestjs/common";

export class DateFutureStatusChangeException extends BadRequestException {
    constructor() {
        super('The status cannot be changed to done because the date administered is in the future');
    }
}
