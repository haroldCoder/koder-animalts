import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { PetService } from "@pet/infrastructure/pet.service";
import { RegisterPetDto, UpdatePetDto } from "@pet/infrastructure/dto";

@Controller("pet")
export class PetController {
    constructor(private readonly petService: PetService) { }

    @Post("register")
    async registerPet(@Body() pet: RegisterPetDto) {
        return this.petService.registerPet(pet);
    }

    @Put(":id")
    async updatePet(@Param("id") id: string, @Body() pet: UpdatePetDto) {
        return this.petService.updatePet(pet, id);
    }

    @Delete(":id")
    async deletePet(@Param("id") id: string) {
        return this.petService.deletePet(id);
    }

    @Get(":id")
    async getPetById(@Param("id") id: string) {
        return this.petService.getPetById(id);
    }
}
