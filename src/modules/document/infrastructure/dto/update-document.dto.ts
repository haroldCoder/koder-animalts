import { PartialType } from "@nestjs/mapped-types";
import { RegisterDocumentDto } from "./register-document.dto";

export class UpdateDocumentDto extends PartialType(RegisterDocumentDto) { }
