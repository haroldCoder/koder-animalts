import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignUpDto {
    @ApiProperty({ description: 'Correo electrónico del nuevo usuario', example: 'usuario@example.com' })
    @IsEmail({}, { message: "El correo electrónico no es válido" })
    @IsNotEmpty({ message: "El correo electrónico es requerido" })
    email: string;

    @ApiProperty({ description: 'Nombre completo del usuario', example: 'Juan Pérez' })
    @IsString()
    @IsNotEmpty({ message: "El nombre es requerido" })
    name: string;

    @ApiProperty({ description: 'Contraseña del usuario', example: 'Password123!' })
    @IsString()
    @IsNotEmpty({ message: "La contraseña es requerida" })
    password: string;

    @ApiProperty({ description: 'URL de imagen de perfil (opcional, o subida como archivo)', example: 'https://res.cloudinary.com/demo/image/upload/avatar.jpg', required: false })
    @IsString()
    @IsOptional()
    image?: string;
}
