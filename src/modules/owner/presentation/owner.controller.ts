import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { CreateOwnerUseCase, FindOwnerByUserIdUseCase } from "@owner/application/use-cases";
import { CreateOwnerDto } from "@owner/presentation/dtos";

@Controller('owner')
export class OwnerController {
    constructor(
        private readonly createOwnerUseCase: CreateOwnerUseCase,
        private readonly findOwnerByUserIdUseCase: FindOwnerByUserIdUseCase) { }

    @Post("create")
    async createOwner(@Body() owner: CreateOwnerDto) {
        return this.createOwnerUseCase.execute(owner);
    }

    @Get("by-user/:userId")
    async getOwnerByUserId(@Param("userId") userId: string) {
        return this.findOwnerByUserIdUseCase.execute(userId);
    }
}
