import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignUpDto {
    @IsEmail({}, { message: "El correo electrónico no es válido" })
    @IsNotEmpty({ message: "El correo electrónico es requerido" })
    email: string;

    @IsString()
    @IsNotEmpty({ message: "El nombre es requerido" })
    name: string;

    @IsString()
    @IsNotEmpty({ message: "La contraseña es requerida" })
    password: string;

    @IsString()
    @IsOptional()
    image?: string;
}
