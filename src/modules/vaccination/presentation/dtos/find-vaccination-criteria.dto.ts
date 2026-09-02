import { VaccinationStatus } from "@vaccination/domain/enums";
import { FindVaccinationsCriteria } from "@vaccination/domain/ports";
import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export class FindVaccinationsCriteriaDto implements FindVaccinationsCriteria {
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
    status?: VaccinationStatus[];
}