import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({ description: 'Propiedad email', example: 'Ejemplo' })
    @IsEmail({}, { message: "El correo electrónico no es válido" })
    @IsNotEmpty({ message: "El correo electrónico es requerido" })
    email: string;

    @ApiProperty({ description: 'Propiedad password', example: 'Ejemplo' })
    @IsString()
    @IsNotEmpty({ message: "La contraseña es requerida" })
    password: string;
}
