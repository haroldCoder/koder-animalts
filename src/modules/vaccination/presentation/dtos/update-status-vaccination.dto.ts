import { ApiProperty } from '@nestjs/swagger';
import { VaccinationStatus } from "../../domain/enums";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UpdateStatusVaccinationDto {
    @ApiProperty({ description: 'Propiedad status', example: 'Ejemplo' })
    @IsEnum(VaccinationStatus)
    @IsNotEmpty()
    status: VaccinationStatus;
}
