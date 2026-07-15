import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { IPetRepository } from "@pet/domain/ports";
import { PetEntity } from "@pet/domain/entities";
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

    private mapToDomain(pet: any): PetEntity {
        return PetEntity.create({
            id: pet.id,
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            gender: pet.gender ? (pet.gender as GenderPet) : null,
            birthDate: pet.birthDate,
            weight: pet.weight,
            color: pet.color,
            microchip: pet.microchip,
            isActive: pet.isActive,
            mainImage: pet.mainImage,
            iaImage: pet.iaImage,
            images: pet.images,
            ownerId: pet.ownerId,
            clinicId: pet.clinicId,
            clinicName: pet.clinic?.name,
            createdAt: pet.createdAt,
            updatedAt: pet.updatedAt,
        });
    }

    async findOwnerIdByUserId(userId: string): Promise<string | null> {
        if (!userId) throw new UserIdNotFoundException();

        const ownerData = await this.prisma.owner.findFirst({
            where: { userId }
        });

        return ownerData?.id ?? null;
    }

    async create(pet: PetEntity): Promise<string> {
        const { id } = await this.prisma.pet.create({
            data: {
                id: pet.getId(),
                name: pet.getName(),
                species: pet.getSpecies(),
                breed: pet.getBreed(),
                gender: pet.getGender(),
                birthDate: pet.getBirthDate(),
                weight: pet.getWeight(),
                color: pet.getColor(),
                microchip: pet.getMicrochip(),
                isActive: pet.getIsActive(),
                mainImage: pet.getMainImage(),
                iaImage: pet.getIaImage(),
                images: pet.getImages(),
                ownerId: pet.getOwnerId(),
                clinicId: pet.getClinicId(),
            }
        });
        return id;
    }

    async update(pet: PetEntity): Promise<string> {
        const { id: petId } = await this.prisma.pet.update({
            where: { id: pet.getId() },
            data: {
                name: pet.getName(),
                species: pet.getSpecies(),
                breed: pet.getBreed(),
                gender: pet.getGender(),
                birthDate: pet.getBirthDate(),
                weight: pet.getWeight(),
                color: pet.getColor(),
                microchip: pet.getMicrochip(),
                isActive: pet.getIsActive(),
                mainImage: pet.getMainImage(),
                iaImage: pet.getIaImage(),
                images: pet.getImages(),
                clinicId: pet.getClinicId(),
            }
        });
        return petId;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.pet.delete({
            where: { id }
        });
    }

    async findById(id: string): Promise<PetEntity | null> {
        const pet = await this.prisma.pet.findUnique({
            where: { id }
        });

        if (!pet) return null;

        return this.mapToDomain(pet);
    }

    async findByVeterinarianId(veterinarianId: string): Promise<PetEntity[] | null> {
        if (!veterinarianId) throw new VeterinarianIdNotFoundException();
        const veterinarian = await this.veterinarianService.findByIdWithDetails(veterinarianId);

        if (!veterinarian) throw new VeterinarianIdNotFoundException();

        const pets = await this.prisma.pet.findMany({
            where: { clinic: { id: veterinarian.getClinicId() } }
        });

        if (!pets) return null;

        return pets.map(pet => this.mapToDomain(pet));
    }

    async findByOwnerId(ownerId: string): Promise<PetEntity[] | null> {
        if (!ownerId) throw new PetOwnerIdNotFoundException();
        const pets = await this.prisma.pet.findMany({
            where: { owner: { id: ownerId } }
        });

        if (!pets) return null;

        return pets.map(pet => this.mapToDomain(pet));
    }

    async findByOwnerUserId(userId: string): Promise<PetEntity[] | null> {
        if (!userId) throw new UserIdNotFoundException();

        const pets = await this.prisma.pet.findMany({
            where: { owner: { user: { id: userId } } },
            include: {
                clinic: { select: { name: true } }
            }
        });

        if (!pets) return null;

        return pets.map(pet => this.mapToDomain(pet));
    }

    async findByVeterinarianUserId(userId: string, petName?: string, ownerName?: string): Promise<PetEntity[] | null> {
        if (!userId) throw new UserIdNotFoundException();

        const pets = await this.prisma.pet.findMany({
            where: {
                clinic: { veterinarians: { some: { userId } } },
                ...(petName || ownerName) && {
                    OR: [
                        { name: { contains: petName, mode: 'insensitive' } },
                        { owner: { user: { name: { contains: ownerName, mode: 'insensitive' } } } }
                    ]
                }
            },
        });

        if (!pets) return null;

        return pets.map(pet => this.mapToDomain(pet));
    }
}
