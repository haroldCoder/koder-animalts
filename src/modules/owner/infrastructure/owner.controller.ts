import { Controller, Post, Body } from "@nestjs/common";
import { OwnerService } from "@owner/infrastructure/owner.service";
import { CreateOwnerDto } from "@owner/infrastructure/dto";

@Controller('owner')
export class OwnerController {
    constructor(private readonly ownerService: OwnerService) { }

    @Post("create")
    async createOwner(@Body() owner: CreateOwnerDto) {
        return this.ownerService.createOwner(owner);
    }
}