import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from "@nestjs/mapped-types";
import { RegisterDocumentModel } from "@/common/domain/models";

export class UpdateDocumentDto extends PartialType(RegisterDocumentModel) { }
