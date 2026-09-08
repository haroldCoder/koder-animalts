import { IsString, IsUUID } from "class-validator";

export class CreateOwnerDto {
    @IsString()
    address: string;

    @IsString()
    phone: string;

    @IsUUID()
    userId: string;
}