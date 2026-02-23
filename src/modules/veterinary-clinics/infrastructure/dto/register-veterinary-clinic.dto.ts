import { IsString } from "class-validator";

export class RegisterVeterinaryClinicDto {
    @IsString()
    name: string;

    @IsString()
    address: string;

    @IsString()
    phone: string;

    @IsString()
    email: string;
}