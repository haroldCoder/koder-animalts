import { PartialType } from "@nestjs/swagger";
import { RegisterPetDto } from "./register-pet.dto";

export class UpdatePetDto extends PartialType(RegisterPetDto) { }