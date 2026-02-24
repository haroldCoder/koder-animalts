import { HttpStatus, Injectable } from "@nestjs/common";
import { RegisterPetDto, UpdatePetDto } from "@pet/infrastructure/dto";
import { PrismaService } from "@/common/infrastructure/db";
import { PetClinicIdNotFoundException, PetIdNotFoundException, PetMainImageNotFoundException, PetNameNotFoundException, PetOwnerIdNotFoundException, PetSpeciesNotFoundException } from "@pet/domain/exceptions";
import { ResponseDto } from "@/common/dto/response.dto";
import { PetEntity } from "@pet/domain/entities";
import { GenderPet } from "@pet/domain/enums";

@Injectable()
export class PetService {
    constructor(private readonly prisma: PrismaService) { }

    async registerPet(pet: RegisterPetDto): Promise<ResponseDto<string>> {
        const { mainImage, name, species, ownerId, clinicId } = pet;

        if (!mainImage) {
            throw new PetMainImageNotFoundException()
        }

        if (!name) {
            throw new PetNameNotFoundException()
        }

        if (!species) {
            throw new PetSpeciesNotFoundException()
        }

        if (!ownerId) {
            throw new PetOwnerIdNotFoundException()
        }

        if (!clinicId) {
            throw new PetClinicIdNotFoundException()
        }

        await this.prisma.pet.create({
            data: pet
        });

        return {
            statusCode: HttpStatus.CREATED,
            message: "Pet registered successfully",
        }
    }

    async updatePet(pet: UpdatePetDto, id: string): Promise<ResponseDto<string>> {
        if (!id) {
            throw new PetIdNotFoundException()
        }

        await this.prisma.pet.update({
            where: {
                id
            },
            data: pet
        });

        return {
            statusCode: HttpStatus.OK,
            message: "Pet updated successfully",
        }
    }

    async deletePet(id: string): Promise<ResponseDto<string>> {
        if (!id) {
            throw new PetIdNotFoundException()
        }

        await this.prisma.pet.delete({
            where: {
                id
            }
        });

        return {
            statusCode: HttpStatus.OK,
            message: "Pet deleted successfully",
        }
    }

    async getPetById(id: string): Promise<ResponseDto<PetEntity>> {
        if (!id) {
            throw new PetIdNotFoundException()
        }

        const pet = await this.prisma.pet.findUnique({
            where: {
                id
            }
        });

        if (!pet) {
            throw new PetIdNotFoundException()
        }

        return {
            statusCode: HttpStatus.OK,
            data: { ...pet, gender: pet.gender as GenderPet }
        }
    }
}