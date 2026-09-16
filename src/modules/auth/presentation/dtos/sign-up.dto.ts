import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignUpDto {
    @ApiProperty({ description: 'Propiedad email', example: 'Ejemplo' })
    @IsEmail({}, { message: "El correo electrónico no es válido" })
    @IsNotEmpty({ message: "El correo electrónico es requerido" })
    email: string;

    @ApiProperty({ description: 'Propiedad name', example: 'Ejemplo' })
    @IsString()
    @IsNotEmpty({ message: "El nombre es requerido" })
    name: string;

    @ApiProperty({ description: 'Propiedad password', example: 'Ejemplo' })
    @IsString()
    @IsNotEmpty({ message: "La contraseña es requerida" })
    password: string;

    @ApiProperty({ description: 'Propiedad image', example: 'Ejemplo' })
    @IsString()
    @IsOptional()
    image?: string;
}
