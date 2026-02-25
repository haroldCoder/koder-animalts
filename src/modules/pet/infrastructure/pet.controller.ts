import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { PetService } from "@pet/infrastructure/pet.service";
import { UpdatePetDto, RegisterPetRequestDto } from "@pet/infrastructure/dto";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { UploadFileCommand } from "@/common/upload/application/use-cases";
import { UploadPlatformEnum } from "@/common/upload/domain/enums";
import { FolderUploadTypes } from "@/common/upload/domain/enums";
import { UploadFileResponseDto } from "@/common/upload/infrastructure/dto";
import { PetMainImageNotFoundException } from "@pet/domain/exceptions";

@Controller("pet")
export class PetController {
    constructor(private readonly petService: PetService) { }

    @Post("register")
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'file_main', maxCount: 1 },
            { name: 'file_ia', maxCount: 1 },
            { name: 'files', maxCount: 10 },
        ])
    )

    async registerPet(@Body() pet: RegisterPetRequestDto, @UploadedFiles() files: {
        file_main?: Express.Multer.File[];
        file_ia?: Express.Multer.File[];
        files?: Express.Multer.File[];
    },) {
        const filesUrl: string[] = [];

        if (!files.file_main) {
            throw new PetMainImageNotFoundException();
        }

        let fileUrlMain: string = (await new UploadFileCommand(files.file_main![0], UploadPlatformEnum.CLOUDINARY, FolderUploadTypes.PETS).execute()).fileUrl;;
        let fileUrlIa: string;

        if (files.file_ia) {
            fileUrlIa = (await new UploadFileCommand(files.file_ia[0], UploadPlatformEnum.CLOUDINARY, FolderUploadTypes.PETS).execute()).fileUrl;
        }

        if (files.files) {
            for (const file of files.files) {
                const { fileUrl }: UploadFileResponseDto = await new UploadFileCommand(file, UploadPlatformEnum.CLOUDINARY, FolderUploadTypes.PETS).execute();
                filesUrl.push(fileUrl);
            }
        }
        return this.petService.registerPet({ ...pet, mainImage: fileUrlMain, ...(fileUrlIa! && { iaImage: fileUrlIa }), ...(filesUrl.length > 0 && { images: filesUrl }) });
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
