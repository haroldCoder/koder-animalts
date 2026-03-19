import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { IPetRepository } from "@pet/domain/ports";
import { CreatePetModel, PetModel, UpdatePetModel } from "@pet/domain/models";
import { GenderPet } from "@pet/domain/enums";
import { UserIdNotFoundException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";
import { PetOwnerIdNotFoundException } from "@pet/domain/exceptions";
import { PrismaVeterinarianService } from "@veterinarian/infrastructure";

@Injectable()
export class PrismaPetService implements IPetRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly veterinarianService: PrismaVeterinarianService
    ) { }

    async create(data: CreatePetModel): Promise<string> {
        const { id } = await this.prisma.pet.create({ data });
        return id;
    }

    async update(id: string, data: UpdatePetModel): Promise<string> {
        const { id: petId } = await this.prisma.pet.update({
            where: { id },
            data
        });
        return petId;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.pet.delete({
            where: { id }
        });
    }

    async findById(id: string): Promise<PetModel | null> {
        const pet = await this.prisma.pet.findUnique({
            where: { id }
        });

        if (!pet) return null;

        return { ...pet, gender: pet.gender as GenderPet };
    }

    async findByVeterinarianId(veterinarianId: string): Promise<PetModel[] | null> {
        if (!veterinarianId) throw new VeterinarianIdNotFoundException();
        const veterinarian = await this.veterinarianService.findByIdWithDetails(veterinarianId);

        if (!veterinarian) throw new VeterinarianIdNotFoundException();

        const pets = await this.prisma.pet.findMany({
            where: { clinic: { id: veterinarian.clinicId } }
        });

        if (!pets) return null;

        return pets.map(pet => ({ ...pet, gender: pet.gender as GenderPet }));
    }

    async findByOwnerId(ownerId: string): Promise<PetModel[] | null> {
        if (!ownerId) throw new PetOwnerIdNotFoundException;
        const pets = await this.prisma.pet.findMany({
            where: { owner: { id: ownerId } }
        });

        if (!pets) return null;

        return pets.map(pet => ({ ...pet, gender: pet.gender as GenderPet }));
    }
}
