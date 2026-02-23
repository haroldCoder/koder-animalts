import { IsString } from "class-validator";

export class CreateVeterinarianDto {
    @IsString()
    specialty: string;
    @IsString()
    phone: string;
    @IsString()
    userId: string;
    @IsString()
    clinicId: string;
}