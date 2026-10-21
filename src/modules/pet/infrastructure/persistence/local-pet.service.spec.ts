import { LocalPetService } from "./local-pet.service";
import { LocalPetStore } from "./local-pet.store";
import { LocalStorageStore } from "@auth/infrastructure/persistence";
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
import { ClinicNotExistException } from "@veterinary-clinics/domain/exceptions";

import { LocalStorageStore as CommonLocalStorageStore } from "@/common/infrastructure/persistence";

describe("LocalPetService", () => {
    let service: LocalPetService;
    let store: LocalStorageStore;
    let petStore: LocalPetStore;
    let commonStore: CommonLocalStorageStore;

    beforeEach(() => {
        service = new LocalPetService();
        commonStore = CommonLocalStorageStore.getInstance();
        store = LocalStorageStore.getInstance();
        petStore = LocalPetStore.getInstance();
        commonStore.clear();
        store.clear();
        petStore.clear();
    });

    afterAll(() => {
        commonStore.clear();
        store.clear();
        petStore.clear();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("Pet CRUD operations", () => {
        it("should create and find a pet by id", async () => {
            const pet = PetEntity.create({
                id: "pet-test-100",
                name: "Luna",
                species: "Felino",
                breed: "Siamés",
                gender: GenderPet.FEMALE,
                birthDate: new Date("2023-01-01"),
                weight: 4.2,
                color: "Blanco y café",
                microchip: "111222333",
                isActive: true,
                mainImage: "https://example.com/luna.jpg",
                images: ["https://example.com/luna2.jpg"],
                ownerId: "owner-001",
                clinicId: "clinic-001",
            });

            const id = await service.create(pet);
            expect(id).toBe("pet-test-100");

            const found = await service.findById("pet-test-100");
            expect(found).toBeDefined();
            expect(found?.getId()).toBe("pet-test-100");
            expect(found?.getName()).toBe("Luna");
            expect(found?.getSpecies()).toBe("Felino");
            expect(found?.getClinicName()).toBe("Clínica Veterinaria San Roque");
        });

        it("should update an existing pet", async () => {
            const pet = await service.findById("pet-001");
            expect(pet).toBeDefined();

            pet!.updateDetails({ name: "Maximus Prime", weight: 28.0 });
            const updatedId = await service.update(pet!);
            expect(updatedId).toBe("pet-001");

            const updated = await service.findById("pet-001");
            expect(updated?.getName()).toBe("Maximus Prime");
            expect(updated?.getWeight()).toBe(28.0);
        });

        it("should throw PetIdNotExistException when updating non-existent pet", async () => {
            const fakePet = PetEntity.create({
                id: "fake-pet-999",
                name: "Fake",
                species: "Canino",
                mainImage: "https://example.com/fake.jpg",
                ownerId: "owner-001",
                clinicId: "clinic-001",
            });

            await expect(service.update(fakePet)).rejects.toThrow(PetIdNotExistException);
        });

        it("should delete a pet and its background", async () => {
            const existing = await service.findById("pet-001");
            expect(existing).toBeDefined();

            await service.delete("pet-001");

            const afterDelete = await service.findById("pet-001");
            expect(afterDelete).toBeNull();

            // Background should also be deleted or not found
            await expect(service.findBackgroundByPetId("pet-001")).rejects.toThrow(PetIdNotExistException);
        });

        it("should throw PetIdNotExistException when deleting non-existent pet", async () => {
            await expect(service.delete("non-existent")).rejects.toThrow(PetIdNotExistException);
        });
    });

    describe("Pet queries by role and filters", () => {
        it("should find pets by owner id", async () => {
            const pets = await service.findByOwnerId("owner-001");
            expect(pets).toBeDefined();
            expect(pets!.length).toBeGreaterThan(0);
            expect(pets![0].getOwnerId()).toBe("owner-001");
        });

        it("should throw PetOwnerIdNotFoundException when ownerId is empty", async () => {
            await expect(service.findByOwnerId("")).rejects.toThrow(PetOwnerIdNotFoundException);
        });

        it("should find pets by owner user id", async () => {
            const pets = await service.findByOwnerUserId("user-owner-001");
            expect(pets).toBeDefined();
            expect(pets!.length).toBeGreaterThan(0);
        });

        it("should return null when owner user has no owner profile", async () => {
            const pets = await service.findByOwnerUserId("user-without-owner");
            expect(pets).toBeNull();
        });

        it("should find pets by veterinarian id", async () => {
            const pets = await service.findByVeterinarianId("vet-001");
            expect(pets).toBeDefined();
            expect(pets!.length).toBeGreaterThan(0);
        });

        it("should throw VeterinarianIdNotFoundException when vet is not found", async () => {
            await expect(service.findByVeterinarianId("vet-fake")).rejects.toThrow(VeterinarianIdNotFoundException);
        });

        it("should find pets by veterinarian user id with name filter", async () => {
            const pets = await service.findByVeterinarianUserId("user-vet-001", "Max");
            expect(pets).toBeDefined();
            expect(pets!.length).toBe(1);
            expect(pets![0].getName()).toBe("Max");

            const emptySearch = await service.findByVeterinarianUserId("user-vet-001", "NonExistentName");
            expect(emptySearch).toEqual([]);
        });

        it("should update clinic of a pet", async () => {
            await service.updateClinic("pet-001", "clinic-002");
            const pet = await service.findById("pet-001");
            expect(pet?.getClinicId()).toBe("clinic-002");
        });

        it("should throw ClinicNotExistException when clinic doesn't exist", async () => {
            await expect(service.updateClinic("pet-001", "clinic-unknown")).rejects.toThrow(ClinicNotExistException);
        });
    });

    describe("Pet Background operations", () => {
        it("should find default background for seeded pet-001", async () => {
            const bg = await service.findBackgroundByPetId("pet-001");
            expect(bg).toBeDefined();
            expect(bg?.getPetId()).toBe("pet-001");
            expect(bg?.getDietType()).toBe("Concentrado");
            expect(bg?.getIsNeutered()).toBe(true);
            expect(bg?.getCoreVaccines()).toBeDefined();
        });

        it("should throw PetIdNotExistException when pet doesn't exist for background query", async () => {
            await expect(service.findBackgroundByPetId("pet-fake-999")).rejects.toThrow(PetIdNotExistException);
        });

        it("should return null if pet exists but has no background", async () => {
            const newPet = PetEntity.create({
                id: "pet-without-bg",
                name: "Rocky",
                species: "Canino",
                mainImage: "https://example.com/rocky.jpg",
                ownerId: "owner-001",
                clinicId: "clinic-001",
            });
            await service.create(newPet);

            const bg = await service.findBackgroundByPetId("pet-without-bg");
            expect(bg).toBeNull();
        });

        it("should upsert a new background for a pet without one", async () => {
            const newPet = PetEntity.create({
                id: "pet-new-bg",
                name: "Toby",
                species: "Canino",
                mainImage: "https://example.com/toby.jpg",
                ownerId: "owner-001",
                clinicId: "clinic-001",
            });
            await service.create(newPet);

            const newBg = PetBackgroundEntity.create({
                id: "bg-new-123",
                petId: "pet-new-bg",
                provenance: "Rescate",
                dietType: "BARF",
                isNeutered: false,
                hasAllergies: true,
                allergiesDescription: "Pollo",
            });

            const saved = await service.upsertBackground(newBg);
            expect(saved).toBeDefined();
            expect(saved.getPetId()).toBe("pet-new-bg");
            expect(saved.getDietType()).toBe("BARF");
            expect(saved.getHasAllergies()).toBe(true);

            const fetched = await service.findBackgroundByPetId("pet-new-bg");
            expect(fetched?.getAllergiesDescription()).toBe("Pollo");
        });

        it("should update an existing background", async () => {
            const existingBg = await service.findBackgroundByPetId("pet-001");
            expect(existingBg).toBeDefined();

            existingBg!.updateDetails({
                dietType: "Mixta",
                hasAllergies: true,
                allergiesDescription: "Picadura de pulga",
            });

            const updated = await service.upsertBackground(existingBg!);
            expect(updated.getDietType()).toBe("Mixta");
            expect(updated.getHasAllergies()).toBe(true);
            expect(updated.getAllergiesDescription()).toBe("Picadura de pulga");
        });

        it("should throw PetIdNotExistException when upserting background for non-existent pet", async () => {
            const invalidBg = PetBackgroundEntity.create({
                id: "bg-fake",
                petId: "pet-non-existent",
            });
            await expect(service.upsertBackground(invalidBg)).rejects.toThrow(PetIdNotExistException);
        });
    });

    describe("validateUserAccessToPet", () => {
        it("should allow pet owner access", async () => {
            const hasAccess = await service.validateUserAccessToPet("user-owner-001", "pet-001");
            expect(hasAccess).toBe(true);
        });

        it("should allow veterinarian of the pet's clinic access", async () => {
            const hasAccess = await service.validateUserAccessToPet("user-vet-001", "pet-001");
            expect(hasAccess).toBe(true);
        });

        it("should deny access to an unrelated user", async () => {
            store.upsertUser("stranger@koder.com", "Stranger");
            const stranger = store.findUserByEmail("stranger@koder.com");
            expect(stranger).toBeDefined();

            const hasAccess = await service.validateUserAccessToPet(stranger!.getId(), "pet-001");
            expect(hasAccess).toBe(false);
        });

        it("should throw PetIdNotExistException if pet does not exist", async () => {
            await expect(service.validateUserAccessToPet("user-owner-001", "pet-fake")).rejects.toThrow(
                PetIdNotExistException
            );
        });

        it("should throw UserIdNotFoundException if user does not exist", async () => {
            await expect(service.validateUserAccessToPet("user-fake-999", "pet-001")).rejects.toThrow(
                UserIdNotFoundException
            );
        });
    });
});
