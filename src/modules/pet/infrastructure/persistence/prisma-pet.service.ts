import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db";
import { IPetRepository } from "@pet/domain/ports";
import { PetEntity, PetBackgroundEntity } from "@pet/domain/entities";
import { GenderPet } from "@pet/domain/enums";
import { PetIdNotExistException, PetIdNotFoundException, UserIdNotFoundException, VeterinarianIdNotFoundException } from "@/common/domain/exceptions";
import { PetOwnerIdNotFoundException, PetBackgroundIdNotFoundException } from "@pet/domain/exceptions";
import { PrismaVeterinarianService } from "@veterinarian/infrastructure";
import { ClinicIdNotFoundException } from "@veterinarian/domain/exceptions";
import { ClinicNotExistException } from "@veterinary-clinics/domain/exceptions";

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

    async updateClinic(petId: string, clinicId: string): Promise<void> {
        if (!petId) throw new PetIdNotFoundException();
        if (!clinicId) throw new ClinicIdNotFoundException();

        const clinic = await this.prisma.veterinaryClinic.findUnique({
            where: { id: clinicId }
        });

        if (!clinic) throw new ClinicNotExistException(clinicId);

        const pet = await this.prisma.pet.findUnique({
            where: { id: petId }
        });

        if (!pet) throw new PetIdNotExistException();

        await this.prisma.pet.update({
            where: { id: petId },
            data: { clinicId }
        });
    }

    private mapBackgroundToDomain(background: any): PetBackgroundEntity {
        return PetBackgroundEntity.create({
            id: background.id,
            petId: background.petId,
            provenance: background.provenance,
            dietType: background.dietType,
            dietDetails: background.dietDetails,
            isNeutered: background.isNeutered,
            neuteredDate: background.neuteredDate,
            previousIllnesses: background.previousIllnesses,
            hasAllergies: background.hasAllergies,
            allergiesDescription: background.allergiesDescription,
            lastVaccinationDate: background.lastVaccinationDate,
            coreVaccines: background.coreVaccines,
            lastDewormingInternal: background.lastDewormingInternal,
            lastDewormingExternal: background.lastDewormingExternal,
            otherPreventiveNotes: background.otherPreventiveNotes,
            createdAt: background.createdAt,
            updatedAt: background.updatedAt,
        });
    }

    async findBackgroundByPetId(petId: string): Promise<PetBackgroundEntity | null> {
        if (!petId) throw new PetIdNotFoundException();

        const pet = await this.prisma.pet.findUnique({
            where: { id: petId }
        });

        if (!pet) throw new PetIdNotExistException();

        const background = await (this.prisma as any).petBackground.findUnique({
            where: { petId }
        });

        if (!background) return null;

        return this.mapBackgroundToDomain(background);
    }

    async upsertBackground(background: PetBackgroundEntity): Promise<PetBackgroundEntity> {
        if (!background) throw new PetBackgroundIdNotFoundException();
        if (!background.getPetId()) throw new PetIdNotFoundException();

        const pet = await this.prisma.pet.findUnique({
            where: { id: background.getPetId() }
        });

        if (!pet) throw new PetIdNotExistException();

        const data = {
            provenance: background.getProvenance(),
            dietType: background.getDietType(),
            dietDetails: background.getDietDetails(),
            isNeutered: background.getIsNeutered(),
            neuteredDate: background.getNeuteredDate(),
            previousIllnesses: background.getPreviousIllnesses(),
            hasAllergies: background.getHasAllergies(),
            allergiesDescription: background.getAllergiesDescription(),
            lastVaccinationDate: background.getLastVaccinationDate(),
            coreVaccines: background.getCoreVaccines(),
            lastDewormingInternal: background.getLastDewormingInternal(),
            lastDewormingExternal: background.getLastDewormingExternal(),
            otherPreventiveNotes: background.getOtherPreventiveNotes(),
        };

        const upserted = await (this.prisma as any).petBackground.upsert({
            where: { petId: background.getPetId() },
            create: {
                id: background.getId(),
                petId: background.getPetId(),
                ...data,
            },
            update: {
                ...data,
                updatedAt: new Date(),
            }
        });

        return this.mapBackgroundToDomain(upserted);
    }

    async validateUserAccessToPet(userId: string, petId: string): Promise<boolean> {
        if (!userId) throw new UserIdNotFoundException();
        if (!petId) throw new PetIdNotFoundException();

        const pet = await this.prisma.pet.findUnique({
            where: { id: petId },
            include: {
                owner: true,
                clinic: {
                    include: {
                        veterinarians: true,
                    }
                }
            }
        });

        if (!pet) throw new PetIdNotExistException();

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                owner: true,
                veterinarian: true,
            }
        });

        if (!user) throw new UserIdNotFoundException();

        // 1. Si es el dueño de la mascota
        if (user.owner && pet.ownerId === user.owner.id) {
            return true;
        }

        // 2. Si es veterinario de la clínica de la mascota
        if (user.veterinarian && pet.clinicId === user.veterinarian.clinicId) {
            return true;
        }

        return false;
    }
}
