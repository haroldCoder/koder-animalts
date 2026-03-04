import { IsString } from "class-validator";

export class CreateOwnerDto {
    @IsString()
    address: string;
    @IsString()
    phone: string;
    @IsString()
    userId: string;
}