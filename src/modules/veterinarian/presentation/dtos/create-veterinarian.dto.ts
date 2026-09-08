import { IsString, IsUUID } from "class-validator";

export class CreateVeterinarianDto {
    @IsString()
    specialty: string;

    @IsString()
    phone: string;

    @IsUUID()
    userId: string;

    @IsUUID()
    clinicId: string;
}