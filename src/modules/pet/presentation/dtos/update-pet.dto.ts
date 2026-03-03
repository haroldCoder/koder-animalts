import { PartialType } from "@nestjs/mapped-types";
import { RegisterPetDto } from "@pet/presentation/dtos";

export class UpdatePetDto extends PartialType(RegisterPetDto) { }