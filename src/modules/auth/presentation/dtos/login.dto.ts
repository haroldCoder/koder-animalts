import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({ description: 'Correo electrónico del usuario', example: 'usuario@example.com' })
    @IsEmail({}, { message: "El correo electrónico no es válido" })
    @IsNotEmpty({ message: "El correo electrónico es requerido" })
    email: string;

    @ApiProperty({ description: 'Contraseña del usuario', example: 'Password123!' })
    @IsString()
    @IsNotEmpty({ message: "La contraseña es requerida" })
    password: string;
}
