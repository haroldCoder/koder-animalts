import { RegisterPetDto } from "@pet/infrastructure/dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdatePetDto extends PartialType(RegisterPetDto) { }