import { BadRequestException } from "@nestjs/common";

export class DocumentFileUrlNotFoundException extends BadRequestException {
    constructor() {
        super("Document file URL not found");
    }
}
