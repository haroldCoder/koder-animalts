import { Controller, Post, Body } from "@nestjs/common";
import { CreateOwnerUseCase } from "@owner/application/use-cases";
import { CreateOwnerDto } from "@owner/presentation/dtos";

@Controller('owner')
export class OwnerController {
    constructor(private readonly createOwnerUseCase: CreateOwnerUseCase) { }

    @Post("create")
    async createOwner(@Body() owner: CreateOwnerDto) {
        return this.createOwnerUseCase.execute(owner);
    }
}
