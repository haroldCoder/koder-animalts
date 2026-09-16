import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from "class-validator";

export class CreateVeterinarianDto {
    @ApiProperty({ description: 'Propiedad specialty', example: 'Ejemplo' })
    @IsString()
    specialty: string;

    @ApiProperty({ description: 'Propiedad phone', example: 'Ejemplo' })
    @IsString()
    phone: string;

    @ApiProperty({ description: 'Propiedad userId', example: 'Ejemplo' })
    @IsUUID()
    userId: string;

    @ApiProperty({ description: 'Propiedad clinicId', example: 'Ejemplo' })
    @IsUUID()
    clinicId: string;
}