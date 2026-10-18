import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "@user/domain/enums";

export class CompleteRegistrationDto {
    @ApiProperty({
        description: "ID del usuario (opcional si se envía Bearer token)",
        example: "123e4567-e89b-12d3-a456-426614174000",
        required: false,
    })
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiProperty({
        description: "Rol seleccionado: VETERINARIAN u OWNER",
        enum: UserRole,
        example: UserRole.OWNER,
    })
    @IsEnum(UserRole, { message: "El rol debe ser VETERINARIAN u OWNER" })
    @IsNotEmpty({ message: "El rol es requerido" })
    role: UserRole;

    @ApiProperty({ description: "Número de teléfono", example: "+573001234567" })
    @IsString()
    @IsNotEmpty({ message: "El teléfono es requerido" })
    phone: string;

    @ApiProperty({
        description: "Dirección física de residencia (requerido para OWNER)",
        example: "Calle 10 # 20-30",
        required: false,
    })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({
        description: "ID de la clínica veterinaria (requerido para VETERINARIAN)",
        example: "clinic-001",
        required: false,
    })
    @IsString()
    @IsOptional()
    clinicId?: string;

    @ApiProperty({
        description: "Especialidad médica (opcional para VETERINARIAN)",
        example: "Cirugía y Traumatología",
        required: false,
    })
    @IsString()
    @IsOptional()
    specialty?: string;
}
