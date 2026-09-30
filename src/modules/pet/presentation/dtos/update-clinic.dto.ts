import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdatePetClinicDto {
    @ApiProperty({ description: "ID de la clínica veterinaria", example: "123e4567-e89b-12d3-a456-426614174000" })
    @IsNotEmpty()
    @IsUUID()
    clinicId: string;
}
