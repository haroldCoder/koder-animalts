import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from "class-validator";

export class CreateOwnerDto {
    @ApiProperty({ description: 'Propiedad address', example: 'Ejemplo' })
    @IsString()
    address: string;

    @ApiProperty({ description: 'Propiedad phone', example: 'Ejemplo' })
    @IsString()
    phone: string;

    @ApiProperty({ description: 'Propiedad userId', example: 'Ejemplo' })
    @IsUUID()
    userId: string;
}