import { IsOptional, IsString } from "class-validator";

export class RegisterVeterinaryClinicDto {
    @IsString()
    name: string;

    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    email?: string;
}
