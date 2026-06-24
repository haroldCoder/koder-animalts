import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { RegisterPetUseCase, UpdatePetUseCase, DeletePetUseCase, GetPetByIdUseCase, GetPetByVeterinarianIdUseCase, GetPetByOwnerIdUseCase, GetPetByUserOwnerUseCase, GetPetByVeterinarianUserIdUseCase } from "@pet/application/use-cases";
import { RegisterPetDto, UpdatePetDto } from "@pet/presentation/dtos";
import { UploadFileCommand } from "@/common/upload/application/use-cases";
import { FolderUploadTypes, UploadPlatformEnum } from "@/common/upload/domain/enums";

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
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'iaImage', maxCount: 1 },
        { name: 'images', maxCount: 10 }
    ]))
    async registerPet(
        @Body() pet: RegisterPetDto,
        @UploadedFiles() files: { mainImage: Express.Multer.File[], iaImage?: Express.Multer.File[], images?: Express.Multer.File[] }
    ) {
        let mainImage = "";
        let iaImage = "";
        const images: string[] = [];

        if (!files?.mainImage?.[0]) throw new Error("Main image is required");

        mainImage = (await new UploadFileCommand(files.mainImage[0], UploadPlatformEnum.CLOUDINARY, FolderUploadTypes.PETS).execute()).fileUrl;

        if (files?.iaImage?.[0]) {
            iaImage = (await new UploadFileCommand(files.iaImage[0], UploadPlatformEnum.CLOUDINARY, FolderUploadTypes.PETS).execute()).fileUrl;
        }

        if (files?.images?.length) {
            for (const file of files.images) {
                const { fileUrl } = await new UploadFileCommand(file, UploadPlatformEnum.CLOUDINARY, FolderUploadTypes.PETS).execute();
                images.push(fileUrl);
            }
        }

        const { userId, ...petData } = pet;

        return this.registerPetUseCase.execute({
            ...petData,
            mainImage,
            iaImage,
            images: files?.images?.length ? images : undefined
        }, userId);
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
