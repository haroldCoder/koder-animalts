import { Injectable } from "@nestjs/common";
import { IPetRepository } from "@pet/domain/ports";
import { PetEntity, PetBackgroundEntity } from "@pet/domain/entities";
import { GenderPet } from "@pet/domain/enums";
import {
    PetIdNotExistException,
    PetIdNotFoundException,
    UserIdNotFoundException,
    VeterinarianIdNotFoundException,
} from "@/common/domain/exceptions";
import {
    PetOwnerIdNotFoundException,
    PetBackgroundIdNotFoundException,
} from "@pet/domain/exceptions";
import { ClinicIdNotFoundException } from "@veterinarian/domain/exceptions";
import { ClinicNotExistException } from "@veterinary-clinics/domain/exceptions";
import { LocalStorageStore as CommonLocalStorageStore } from "@/common/infrastructure/persistence";
import { LocalStorageStore as AuthLocalStorageStore } from "@auth/infrastructure/persistence";
import {
    LocalPetStore,
    StoredPet,
    StoredPetBackground,
} from "./local-pet.store";

@Injectable()
export class LocalPetService implements IPetRepository {
    private readonly petStore: LocalPetStore;
    private readonly commonStore: CommonLocalStorageStore;
    private readonly authStore: AuthLocalStorageStore;

    constructor() {
        this.petStore = LocalPetStore.getInstance();
        this.commonStore = CommonLocalStorageStore.getInstance();
        this.authStore = AuthLocalStorageStore.getInstance();
    }

    private mapToDomain(pet: StoredPet): PetEntity {
        const clinic = this.commonStore.findClinicById(pet.clinicId);
        return PetEntity.create({
            id: pet.id,
            name: pet.name,
            species: pet.species,
            breed: pet.breed ?? null,
            gender: pet.gender ? (pet.gender as GenderPet) : null,
            birthDate: pet.birthDate ? new Date(pet.birthDate) : null,
            weight: pet.weight ?? null,
            color: pet.color ?? null,
            microchip: pet.microchip ?? null,
            isActive: pet.isActive,
            mainImage: pet.mainImage,
            iaImage: pet.iaImage ?? null,
            images: pet.images || [],
            ownerId: pet.ownerId,
            clinicId: pet.clinicId,
            clinicName: clinic?.name,
            createdAt: new Date(pet.createdAt),
            updatedAt: new Date(pet.updatedAt),
        });
    }

    private mapBackgroundToDomain(bg: StoredPetBackground): PetBackgroundEntity {
        return PetBackgroundEntity.create({
            id: bg.id,
            petId: bg.petId,
            provenance: bg.provenance ?? null,
            dietType: bg.dietType ?? null,
            dietDetails: bg.dietDetails ?? null,
            isNeutered: bg.isNeutered ?? false,
            neuteredDate: bg.neuteredDate ? new Date(bg.neuteredDate) : null,
            previousIllnesses: bg.previousIllnesses ?? null,
            hasAllergies: bg.hasAllergies ?? false,
            allergiesDescription: bg.allergiesDescription ?? null,
            lastVaccinationDate: bg.lastVaccinationDate ? new Date(bg.lastVaccinationDate) : null,
            coreVaccines: bg.coreVaccines ?? null,
            lastDewormingInternal: bg.lastDewormingInternal ? new Date(bg.lastDewormingInternal) : null,
            lastDewormingExternal: bg.lastDewormingExternal ? new Date(bg.lastDewormingExternal) : null,
            otherPreventiveNotes: bg.otherPreventiveNotes ?? null,
            createdAt: new Date(bg.createdAt),
            updatedAt: new Date(bg.updatedAt),
        });
    }

    async findOwnerIdByUserId(userId: string): Promise<string | null> {
        if (!userId) throw new UserIdNotFoundException();
        const owner = this.commonStore.findOwnerByUserId(userId);
        return owner?.id ?? null;
    }

    async create(pet: PetEntity): Promise<string> {
        const stored: StoredPet = {
            id: pet.getId(),
            name: pet.getName(),
            species: pet.getSpecies(),
            breed: pet.getBreed(),
            gender: pet.getGender(),
            birthDate: pet.getBirthDate() ? pet.getBirthDate()!.toISOString() : null,
            weight: pet.getWeight(),
            color: pet.getColor(),
            microchip: pet.getMicrochip(),
            isActive: pet.getIsActive(),
            mainImage: pet.getMainImage(),
            iaImage: pet.getIaImage(),
            images: pet.getImages(),
            ownerId: pet.getOwnerId(),
            clinicId: pet.getClinicId(),
            createdAt: pet.getCreatedAt() ? pet.getCreatedAt().toISOString() : new Date().toISOString(),
            updatedAt: pet.getUpdatedAt() ? pet.getUpdatedAt().toISOString() : new Date().toISOString(),
        };

        this.petStore.savePet(stored);
        return pet.getId();
    }

    async update(pet: PetEntity): Promise<string> {
        const existing = this.petStore.findPetById(pet.getId());
        if (!existing) throw new PetIdNotExistException();

        const updated: StoredPet = {
            ...existing,
            name: pet.getName(),
            species: pet.getSpecies(),
            breed: pet.getBreed(),
            gender: pet.getGender(),
            birthDate: pet.getBirthDate() ? pet.getBirthDate()!.toISOString() : null,
            weight: pet.getWeight(),
            color: pet.getColor(),
            microchip: pet.getMicrochip(),
            isActive: pet.getIsActive(),
            mainImage: pet.getMainImage(),
            iaImage: pet.getIaImage(),
            images: pet.getImages(),
            clinicId: pet.getClinicId(),
            updatedAt: new Date().toISOString(),
        };

        this.petStore.savePet(updated);
        return pet.getId();
    }

    async delete(id: string): Promise<void> {
        const existing = this.petStore.findPetById(id);
        if (!existing) throw new PetIdNotExistException();
        this.petStore.deletePet(id);
    }

    async findById(id: string): Promise<PetEntity | null> {
        const pet = this.petStore.findPetById(id);
        if (!pet) return null;
        return this.mapToDomain(pet);
    }

    async findByVeterinarianId(veterinarianId: string): Promise<PetEntity[] | null> {
        if (!veterinarianId) throw new VeterinarianIdNotFoundException();
        const vet = this.commonStore.findVeterinarianById(veterinarianId);
        if (!vet) throw new VeterinarianIdNotFoundException();

        const pets = this.petStore.findPetsByClinicId(vet.clinicId);
        if (!pets || pets.length === 0) return null;
        return pets.map(p => this.mapToDomain(p));
    }

    async findByOwnerId(ownerId: string): Promise<PetEntity[] | null> {
        if (!ownerId) throw new PetOwnerIdNotFoundException();
        const pets = this.petStore.findPetsByOwnerId(ownerId);
        if (!pets || pets.length === 0) return null;
        return pets.map(p => this.mapToDomain(p));
    }

    async findByOwnerUserId(userId: string): Promise<PetEntity[] | null> {
        if (!userId) throw new UserIdNotFoundException();
        const owner = this.commonStore.findOwnerByUserId(userId);
        if (!owner) return null;
        return this.findByOwnerId(owner.id);
    }

    async findByVeterinarianUserId(
        userId: string,
        petName?: string,
        ownerName?: string
    ): Promise<PetEntity[] | null> {
        if (!userId) throw new UserIdNotFoundException();
        const vet = this.commonStore.findVeterinarianByUserId(userId);
        if (!vet) return [];

        let pets = this.petStore.findPetsByClinicId(vet.clinicId);
        if (petName || ownerName) {
            const petTerm = petName?.toLowerCase();
            const ownerTerm = ownerName?.toLowerCase();

            pets = pets.filter(p => {
                let matchesPet = false;
                let matchesOwner = false;

                if (petTerm && p.name.toLowerCase().includes(petTerm)) {
                    matchesPet = true;
                }

                if (ownerTerm) {
                    const owner = this.commonStore.findOwnerById(p.ownerId);
                    if (owner) {
                        const user = this.authStore.findUserById(owner.userId);
                        if (user && user.getName()?.toLowerCase().includes(ownerTerm)) {
                            matchesOwner = true;
                        }
                    }
                }

                return matchesPet || matchesOwner;
            });
        }

        return pets.map(p => this.mapToDomain(p));
    }

    async updateClinic(petId: string, clinicId: string): Promise<void> {
        if (!petId) throw new PetIdNotFoundException();
        if (!clinicId) throw new ClinicIdNotFoundException();

        const clinic = this.commonStore.findClinicById(clinicId);
        if (!clinic) throw new ClinicNotExistException(clinicId);

        const pet = this.petStore.findPetById(petId);
        if (!pet) throw new PetIdNotExistException();

        pet.clinicId = clinicId;
        pet.updatedAt = new Date().toISOString();
        this.petStore.savePet(pet);
    }

    async findBackgroundByPetId(petId: string): Promise<PetBackgroundEntity | null> {
        if (!petId) throw new PetIdNotFoundException();

        const pet = this.petStore.findPetById(petId);
        if (!pet) throw new PetIdNotExistException();

        const bg = this.petStore.findBackgroundByPetId(petId);
        if (!bg) return null;

        return this.mapBackgroundToDomain(bg);
    }

    async upsertBackground(background: PetBackgroundEntity): Promise<PetBackgroundEntity> {
        if (!background) throw new PetBackgroundIdNotFoundException();
        if (!background.getPetId()) throw new PetIdNotFoundException();

        const pet = this.petStore.findPetById(background.getPetId());
        if (!pet) throw new PetIdNotExistException();

        const existing = this.petStore.findBackgroundByPetId(background.getPetId());

        const storedBg: StoredPetBackground = {
            id: existing ? existing.id : background.getId(),
            petId: background.getPetId(),
            provenance: background.getProvenance(),
            dietType: background.getDietType(),
            dietDetails: background.getDietDetails(),
            isNeutered: background.getIsNeutered(),
            neuteredDate: background.getNeuteredDate() ? background.getNeuteredDate()!.toISOString() : null,
            previousIllnesses: background.getPreviousIllnesses(),
            hasAllergies: background.getHasAllergies(),
            allergiesDescription: background.getAllergiesDescription(),
            lastVaccinationDate: background.getLastVaccinationDate() ? background.getLastVaccinationDate()!.toISOString() : null,
            coreVaccines: background.getCoreVaccines(),
            lastDewormingInternal: background.getLastDewormingInternal() ? background.getLastDewormingInternal()!.toISOString() : null,
            lastDewormingExternal: background.getLastDewormingExternal() ? background.getLastDewormingExternal()!.toISOString() : null,
            otherPreventiveNotes: background.getOtherPreventiveNotes(),
            createdAt: existing ? existing.createdAt : (background.getCreatedAt() ? background.getCreatedAt().toISOString() : new Date().toISOString()),
            updatedAt: new Date().toISOString(),
        };

        const saved = this.petStore.upsertPetBackground(storedBg);
        return this.mapBackgroundToDomain(saved);
    }

    async validateUserAccessToPet(userId: string, petId: string): Promise<boolean> {
        if (!userId) throw new UserIdNotFoundException();
        if (!petId) throw new PetIdNotFoundException();

        const pet = this.petStore.findPetById(petId);
        if (!pet) throw new PetIdNotExistException();

        const user = this.authStore.findUserById(userId);
        if (!user) throw new UserIdNotFoundException();

        // 1. Si es el dueño de la mascota
        const owner = this.commonStore.findOwnerByUserId(userId);
        if (owner && pet.ownerId === owner.id) {
            return true;
        }

        // 2. Si es veterinario de la clínica de la mascota
        const vet = this.commonStore.findVeterinarianByUserId(userId);
        if (vet && pet.clinicId === vet.clinicId) {
            return true;
        }

        return false;
    }
}
