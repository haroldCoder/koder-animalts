import { PartialType } from "@nestjs/swagger";
import { RegisterDocumentRequestDto } from "./register-document-request.dto";

export class UpdateDocumentDto extends PartialType(RegisterDocumentRequestDto) { }

