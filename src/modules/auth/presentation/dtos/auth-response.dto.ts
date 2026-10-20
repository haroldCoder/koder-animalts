import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@user/domain/enums";

export class UserAuthProfileDto {
    @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
    id: string;

    @ApiProperty({ example: "usuario@example.com" })
    email: string;

    @ApiProperty({ example: "Juan Pérez", nullable: true })
    name: string | null;

    @ApiProperty({ example: "https://example.com/avatar.jpg", nullable: true })
    image: string | null;

    @ApiProperty({ enum: UserRole, example: UserRole.OWNER })
    role: UserRole;

    @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174001", required: false, nullable: true })
    ownerId?: string | null;

    @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174002", required: false, nullable: true })
    veterinarianId?: string | null;

    @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174003", required: false, nullable: true })
    clinicId?: string | null;

    @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174004", required: false, nullable: true })
    userId: string;
}

export class AuthResponseDataDto {
    @ApiProperty({
        description: "Token de acceso JWT (corta duración)",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    accessToken: string;

    @ApiProperty({
        description: "Token de actualización JWT (larga duración)",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    refreshToken: string;

    @ApiProperty({ type: UserAuthProfileDto })
    user: UserAuthProfileDto;
}
