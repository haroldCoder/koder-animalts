import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { IPetRepository } from "@pet/domain/ports";
import { CreatePetModel, PetModel, UpdatePetModel } from "@pet/domain/models";
import { GenderPet } from "@pet/domain/enums";

@Injectable()
export class PrismaPetService implements IPetRepository {
    constructor(private readonly prisma: PrismaService) { }

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
}
