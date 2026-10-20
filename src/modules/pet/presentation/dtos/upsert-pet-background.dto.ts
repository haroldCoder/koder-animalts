import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsOptional, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

const parseDateValue = (value: any): Date | null | undefined => {
    if (value === undefined) return undefined;
    if (value === null || value === "") return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
};

export class UpsertPetBackgroundDto {
    @ApiPropertyOptional({ description: "ID de la mascota (opcional si se envía en parámetros de la URL)", example: "123e4567-e89b-12d3-a456-426614174000" })
    @IsString()
    @IsOptional()
    petId?: string;

    @ApiPropertyOptional({ description: "Procedencia (criadero, rescate, adopción, etc.)", example: "Rescate" })
    @IsString()
    @MaxLength(150)
    @IsOptional()
    provenance?: string;

    @ApiPropertyOptional({ description: "Tipo de alimentación (concentrado, BARF, casera, mixta)", example: "Concentrado" })
    @IsString()
    @MaxLength(100)
    @IsOptional()
    dietType?: string;

    @ApiPropertyOptional({ description: "Alias de tipo de alimentación", example: "Concentrado" })
    @IsString()
    @MaxLength(100)
    @IsOptional()
    diet?: string;

    @ApiPropertyOptional({ description: "Marca o detalles de alimentación", example: "Royal Canin Mini Adult" })
    @IsString()
    @IsOptional()
    dietDetails?: string;

    @ApiPropertyOptional({ description: "Castrado Si / No", example: true })
    @IsBoolean()
    @IsOptional()
    isNeutered?: boolean;

    @ApiPropertyOptional({ description: "Fecha aproximada de castración", example: "2023-05-15" })
    @Transform(({ value }) => parseDateValue(value))
    @IsOptional()
    neuteredDate?: Date | null;

    @ApiPropertyOptional({ description: "Enfermedades anteriores / cirugías previas", example: "Ninguna relevante" })
    @IsString()
    @IsOptional()
    previousIllnesses?: string;

    @ApiPropertyOptional({ description: "Alergias Si / No", example: false })
    @IsBoolean()
    @IsOptional()
    hasAllergies?: boolean;

    @ApiPropertyOptional({ description: "Detalle de alergias (medicamentos, alimentos, etc.)", example: "Alergia a la pulga" })
    @IsString()
    @IsOptional()
    allergiesDescription?: string;

    @ApiPropertyOptional({ description: "Fecha de última vacunación", example: "2024-01-10" })
    @Transform(({ value }) => parseDateValue(value))
    @IsOptional()
    lastVaccinationDate?: Date | null;

    @ApiPropertyOptional({ description: "Esquema de vacunas aplicadas según especie (JSON)", example: { rabies: true, parvovirus: true } })
    @IsOptional()
    coreVaccines?: any;

    @ApiPropertyOptional({ description: "Vacunas caninas aplicadas", example: { rabies: true, parvovirus: false } })
    @IsOptional()
    canineVaccines?: any;

    @ApiPropertyOptional({ description: "Vacunas felinas aplicadas", example: { rabies: false, calicivirus: false } })
    @IsOptional()
    felineVaccines?: any;

    @ApiPropertyOptional({ description: "Información de desparasitaciones", example: { internalParasites: false, lastInternalDewormingDate: "" } })
    @IsOptional()
    deworming?: any;

    @ApiPropertyOptional({ description: "Última fecha de desparasitación interna", example: "2024-02-01" })
    @Transform(({ value }) => parseDateValue(value))
    @IsOptional()
    lastDewormingInternal?: Date | null;

    @ApiPropertyOptional({ description: "Última fecha de desparasitación externa", example: "2024-02-15" })
    @Transform(({ value }) => parseDateValue(value))
    @IsOptional()
    lastDewormingExternal?: Date | null;

    @ApiPropertyOptional({ description: "Otros tratamientos preventivos", example: "Limpieza dental anual" })
    @IsString()
    @IsOptional()
    otherPreventiveNotes?: string;

    @ApiPropertyOptional({ description: "Notas adicionales sobre vacunas o tratamientos preventivos", example: "Refuerzo pendiente" })
    @IsString()
    @IsOptional()
    otherVaccinesNotes?: string;

    @ApiPropertyOptional({ description: "ID de usuario para validar permisos (opcional si se envía Bearer token)", example: "123e4567-e89b-12d3-a456-426614174000" })
    @IsString()
    @IsOptional()
    userId?: string;
}
