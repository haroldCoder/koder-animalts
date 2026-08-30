import { VaccinationStatus } from "../../domain/enums";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UpdateStatusVaccinationDto {
    @IsEnum(VaccinationStatus)
    @IsNotEmpty()
    status: VaccinationStatus;
}
