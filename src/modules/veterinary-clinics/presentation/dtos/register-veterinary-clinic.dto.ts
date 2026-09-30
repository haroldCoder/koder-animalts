import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RegisterVeterinaryClinicDto {
    @ApiProperty({ description: 'Nombre de la clínica veterinaria', example: 'Clínica San Roque' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Dirección física de la clínica', example: 'Av. Siempre Viva 123' })
    @IsString()
    address: string;

    @ApiProperty({ description: 'Número de teléfono de contacto', example: '+123456789', required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ description: 'Correo electrónico de la clínica', example: 'contacto@sanroque.com', required: false })
    @IsOptional()
    @IsString()
    email?: string;
}
