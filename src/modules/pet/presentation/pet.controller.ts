import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { RegisterPetUseCase, UpdatePetUseCase, DeletePetUseCase, GetPetByIdUseCase, GetPetByVeterinarianIdUseCase, GetPetByOwnerIdUseCase, GetPetByUserOwnerUseCase, GetPetByVeterinarianUserIdUseCase } from "@pet/application/use-cases";
import { RegisterPetDto, UpdatePetDto } from "@pet/presentation/dtos";

@Controller('pet')
export class PetController {
    constructor(
        private readonly registerPetUseCase: RegisterPetUseCase,
        private readonly updatePetUseCase: UpdatePetUseCase,
        private readonly deletePetUseCase: DeletePetUseCase,
        private readonly getPetByIdUseCase: GetPetByIdUseCase,
        private readonly getPetByVeterinarianIdUseCase: GetPetByVeterinarianIdUseCase,
        private readonly getPetByOwnerIdUseCase: GetPetByOwnerIdUseCase,
        private readonly getPetByOwnerUserIdUseCase: GetPetByUserOwnerUseCase,
        private readonly getPetByVeterinarianUserIdUseCase: GetPetByVeterinarianUserIdUseCase,
    ) { }

    @Post("register")
    async registerPet(@Body() pet: RegisterPetDto) {
        return this.registerPetUseCase.execute(pet);
    }

    @Patch(":id")
    async updatePet(@Param("id") id: string, @Body() pet: UpdatePetDto) {
        return this.updatePetUseCase.execute(id, pet);
    }

    @Delete(":id")
    async deletePet(@Param("id") id: string) {
        return this.deletePetUseCase.execute(id);
    }

    @Get(":id")
    async getPetById(@Param("id") id: string) {
        return this.getPetByIdUseCase.execute(id);
    }

    @Get("veterinarian/:veterinarianId")
    async getPetByVeterinarianId(@Param("veterinarianId") veterinarianId: string) {
        return this.getPetByVeterinarianIdUseCase.execute(veterinarianId);
    }

    @Get("owner/:ownerId")
    async getPetByOwnerId(@Param("ownerId") ownerId: string) {
        return this.getPetByOwnerIdUseCase.execute(ownerId);
    }

    @Get("owner/userId/:id")
    async getPetByOwnerUserId(@Param("id") id: string) {
        return this.getPetByOwnerUserIdUseCase.execute(id);
    }

    @Get("veterinarian/userId/:id")
    async getPetByVeterinarianUserId(
        @Param("id") id: string,
        @Query("petName") petName?: string,
        @Query("ownerName") ownerName?: string
    ) {
        return this.getPetByVeterinarianUserIdUseCase.execute(id, petName, ownerName);
    }
}
