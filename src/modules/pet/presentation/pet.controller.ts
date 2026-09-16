import { Body, Controller, Delete, Get, HttpStatus, InternalServerErrorException, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { RegisterPetUseCase, UpdatePetUseCase, DeletePetUseCase, GetPetByIdUseCase, GetPetByVeterinarianIdUseCase, GetPetByOwnerIdUseCase, GetPetByUserOwnerUseCase, GetPetByVeterinarianUserIdUseCase, UpdateClinicUseCase } from "@pet/application/use-cases";
import { RegisterPetDto, UpdatePetDto } from "@pet/presentation/dtos";
import { UploadFileCommand } from "@/common/upload/application/use-cases";
import { FolderUploadTypes, UploadPlatformEnum } from "@/common/upload/domain/enums";
import { ClinicNotExistException } from "@veterinary-clinics/domain/exceptions";
import { ClinicIdNotFoundException } from "@veterinarian/domain/exceptions";
import { ClinicChangeNotAllowedByAppointmentException, PetIdNotExistException, PetIdNotFoundException } from "@/common/domain/exceptions";
import { ResponseDto } from "@/common/domain/dto";

@ApiTags('Pets')
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
        private readonly updateClinicUseCase: UpdateClinicUseCase,
    ) { }

    @ApiOperation({ summary: 'Registrar una nueva mascota' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'Mascota registrada exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o falta la imagen principal.' })
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

    @ApiOperation({ summary: 'Actualizar información de una mascota' })
    @ApiParam({ name: 'id', description: 'ID de la mascota' })
    @ApiResponse({ status: 200, description: 'Mascota actualizada exitosamente.' })
    @Patch(":id")
    async updatePet(@Param("id") id: string, @Body() pet: UpdatePetDto) {
        return this.updatePetUseCase.execute(id, pet);
    }

    @ApiOperation({ summary: 'Eliminar una mascota por ID' })
    @ApiParam({ name: 'id', description: 'ID de la mascota' })
    @ApiResponse({ status: 200, description: 'Mascota eliminada exitosamente.' })
    @Delete(":id")
    async deletePet(@Param("id") id: string) {
        return this.deletePetUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Obtener mascota por ID' })
    @ApiParam({ name: 'id', description: 'ID de la mascota' })
    @ApiResponse({ status: 200, description: 'Datos de la mascota.' })
    @Get(":id")
    async getPetById(@Param("id") id: string) {
        return this.getPetByIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Obtener mascotas por ID de veterinario' })
    @ApiParam({ name: 'veterinarianId', description: 'ID del veterinario' })
    @ApiResponse({ status: 200, description: 'Lista de mascotas asociadas al veterinario.' })
    @Get("veterinarian/:veterinarianId")
    async getPetByVeterinarianId(@Param("veterinarianId") veterinarianId: string) {
        return this.getPetByVeterinarianIdUseCase.execute(veterinarianId);
    }

    @ApiOperation({ summary: 'Obtener mascotas por ID de propietario' })
    @ApiParam({ name: 'ownerId', description: 'ID del propietario' })
    @ApiResponse({ status: 200, description: 'Lista de mascotas del propietario.' })
    @Get("owner/:ownerId")
    async getPetByOwnerId(@Param("ownerId") ownerId: string) {
        return this.getPetByOwnerIdUseCase.execute(ownerId);
    }

    @ApiOperation({ summary: 'Obtener mascotas por ID de usuario del propietario' })
    @ApiParam({ name: 'id', description: 'ID del usuario (propietario)' })
    @ApiResponse({ status: 200, description: 'Lista de mascotas.' })
    @Get("owner/userId/:id")
    async getPetByOwnerUserId(@Param("id") id: string) {
        return this.getPetByOwnerUserIdUseCase.execute(id);
    }

    @ApiOperation({ summary: 'Obtener mascotas por ID de usuario del veterinario' })
    @ApiParam({ name: 'id', description: 'ID del usuario (veterinario)' })
    @ApiQuery({ name: 'petName', required: false, description: 'Filtro por nombre de mascota' })
    @ApiQuery({ name: 'ownerName', required: false, description: 'Filtro por nombre de propietario' })
    @ApiResponse({ status: 200, description: 'Lista de mascotas filtradas.' })
    @Get("veterinarian/userId/:id")
    async getPetByVeterinarianUserId(
        @Param("id") id: string,
        @Query("petName") petName?: string,
        @Query("ownerName") ownerName?: string
    ) {
        return this.getPetByVeterinarianUserIdUseCase.execute(id, petName, ownerName);
    }

    @ApiOperation({ summary: 'Actualizar la clínica asociada a una mascota' })
    @ApiParam({ name: 'petId', description: 'ID de la mascota' })
    @ApiResponse({ status: 200, description: 'Clínica actualizada exitosamente.' })
    @ApiResponse({ status: 400, description: 'Error de validación o lógica de negocio (ej. cambio no permitido por cita).' })
    @ApiResponse({ status: 404, description: 'Mascota o clínica no encontrada.' })
    @Patch("clinic/:petId")
    async updateClinic(
        @Param("petId") petId: string,
        @Body() { clinicId }: { clinicId: string }
    ): Promise<ResponseDto<void>> {
        try {
            await this.updateClinicUseCase.execute(petId, clinicId);

            return {
                statusCode: HttpStatus.OK,
                message: "Clinic updated successfully",
            };
        } catch (error) {
            if (error instanceof ClinicNotExistException
                || error instanceof ClinicIdNotFoundException
                || error instanceof PetIdNotFoundException
                || error instanceof PetIdNotExistException
                || error instanceof ClinicChangeNotAllowedByAppointmentException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}
