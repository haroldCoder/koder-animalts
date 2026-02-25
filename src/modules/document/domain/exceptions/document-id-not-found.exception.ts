import { BadRequestException } from "@nestjs/common";

export class DocumentIdNotFoundException extends BadRequestException {
    constructor() {
        super("Document ID not found");
    }
}
