import { BadRequestException } from "@nestjs/common";

export class DocumentTitleNotFoundException extends BadRequestException {
    constructor() {
        super("Document title not found");
    }
}
