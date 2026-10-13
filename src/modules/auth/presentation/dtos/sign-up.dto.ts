import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "@user/domain/enums";

export class SignUpDto {
    @ApiProperty({ description: "Correo electrónico del nuevo usuario", example: "usuario@example.com" })
    @IsEmail({}, { message: "El correo electrónico no es válido" })
    @IsNotEmpty({ message: "El correo electrónico es requerido" })
    email: string;

    @ApiProperty({ description: "Nombre completo del usuario", example: "Juan Pérez" })
    @IsString()
    @IsNotEmpty({ message: "El nombre es requerido" })
    name: string;

    @ApiProperty({ description: "Contraseña del usuario", example: "Password123!" })
    @IsString()
    @IsNotEmpty({ message: "La contraseña es requerida" })
    password: string;

    @ApiProperty({ description: "URL de imagen de perfil (opcional)", example: "https://example.com/avatar.jpg", required: false })
    @IsString()
    @IsOptional()
    image?: string;

    @ApiProperty({
        description: "Tipo de usuario: VETERINARIAN u OWNER",
        enum: UserRole,
        required: false,
        example: UserRole.OWNER,
    })
    @IsEnum(UserRole, { message: "El rol debe ser VETERINARIAN u OWNER" })
    @IsOptional()
    role?: UserRole;

    @ApiProperty({ description: "Número de teléfono (opcional)", required: false, example: "+573001234567" })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ description: "Dirección física (para OWNER)", required: false, example: "Calle 10 # 20-30" })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ description: "ID de la clínica veterinaria asignada (para VETERINARIAN)", required: false })
    @IsString()
    @IsOptional()
    clinicId?: string;

    @ApiProperty({ description: "Especialidad (para VETERINARIAN)", required: false, example: "Medicina General" })
    @IsString()
    @IsOptional()
    specialty?: string;
}
