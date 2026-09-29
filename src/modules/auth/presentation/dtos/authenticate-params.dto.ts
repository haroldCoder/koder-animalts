import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthenticateParamsDto {
    @ApiProperty({ description: 'Correo electrónico del usuario', example: 'usuario@example.com' })
    email: string;

    @ApiPropertyOptional({ description: 'Nombre del usuario', example: 'Juan Pérez' })
    name?: string;

    @ApiPropertyOptional({ description: 'URL de imagen de perfil', example: 'https://res.cloudinary.com/demo/image/upload/avatar.jpg' })
    image?: string;

    @ApiProperty({ description: 'ID del proveedor de autenticación (ej. google, github)', example: 'google' })
    providerId: string;

    @ApiProperty({ description: 'ID de la cuenta en el proveedor externo', example: '109823456789012345678' })
    accountId: string;

    @ApiPropertyOptional({ description: 'Access token proporcionado por el proveedor' })
    accessToken?: string;

    @ApiPropertyOptional({ description: 'Refresh token proporcionado por el proveedor' })
    refreshToken?: string;

    @ApiPropertyOptional({ description: 'Fecha de expiración del token' })
    expiresAt?: Date;

    @ApiPropertyOptional({ description: 'Dirección IP del cliente', example: '192.168.1.1' })
    ipAddress?: string;

    @ApiPropertyOptional({ description: 'User-Agent del navegador o cliente', example: 'Mozilla/5.0...' })
    userAgent?: string;
}