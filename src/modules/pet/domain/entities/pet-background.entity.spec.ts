import { PetBackgroundEntity } from "./pet-background.entity";
import { PetBackgroundIdNotFoundException } from "../exceptions";
import { PetIdNotFoundException } from "@/common/domain/exceptions";

describe("PetBackgroundEntity", () => {
    const validProps = {
        id: "bg-123",
        petId: "pet-456",
        provenance: "rescate",
        dietType: "croquetas",
        dietDetails: "Royal Canin Gastrointestinal",
        isNeutered: true,
        neuteredDate: new Date("2024-01-15"),
        previousIllnesses: "Gastroenteritis a los 6 meses",
        hasAllergies: true,
        allergiesDescription: "Pollo y pulgas",
        lastVaccinationDate: new Date("2025-05-10"),
        coreVaccines: { rabies: true, distemper: true, parvovirus: true },
        lastDewormingInternal: new Date("2025-06-01"),
        lastDewormingExternal: new Date("2025-06-15"),
        otherPreventiveNotes: "Pipeta antiparasitaria mensual",
    };

    it("should create a PetBackgroundEntity with all properties", () => {
        const entity = PetBackgroundEntity.create(validProps);

        expect(entity.getId()).toBe(validProps.id);
        expect(entity.getPetId()).toBe(validProps.petId);
        expect(entity.getProvenance()).toBe(validProps.provenance);
        expect(entity.getDietType()).toBe(validProps.dietType);
        expect(entity.getDietDetails()).toBe(validProps.dietDetails);
        expect(entity.getIsNeutered()).toBe(true);
        expect(entity.getNeuteredDate()).toEqual(validProps.neuteredDate);
        expect(entity.getPreviousIllnesses()).toBe(validProps.previousIllnesses);
        expect(entity.getHasAllergies()).toBe(true);
        expect(entity.getAllergiesDescription()).toBe(validProps.allergiesDescription);
        expect(entity.getLastVaccinationDate()).toEqual(validProps.lastVaccinationDate);
        expect(entity.getCoreVaccines()).toEqual(validProps.coreVaccines);
        expect(entity.getLastDewormingInternal()).toEqual(validProps.lastDewormingInternal);
        expect(entity.getLastDewormingExternal()).toEqual(validProps.lastDewormingExternal);
        expect(entity.getOtherPreventiveNotes()).toBe(validProps.otherPreventiveNotes);
        expect(entity.getCreatedAt()).toBeInstanceOf(Date);
        expect(entity.getUpdatedAt()).toBeInstanceOf(Date);
    });

    it("should set default values for optional fields when not provided", () => {
        const entity = PetBackgroundEntity.create({
            id: "bg-1",
            petId: "pet-1",
        });

        expect(entity.getId()).toBe("bg-1");
        expect(entity.getPetId()).toBe("pet-1");
        expect(entity.getProvenance()).toBeNull();
        expect(entity.getDietType()).toBeNull();
        expect(entity.getDietDetails()).toBeNull();
        expect(entity.getIsNeutered()).toBe(false);
        expect(entity.getNeuteredDate()).toBeNull();
        expect(entity.getPreviousIllnesses()).toBeNull();
        expect(entity.getHasAllergies()).toBe(false);
        expect(entity.getAllergiesDescription()).toBeNull();
        expect(entity.getLastVaccinationDate()).toBeNull();
        expect(entity.getCoreVaccines()).toBeNull();
        expect(entity.getLastDewormingInternal()).toBeNull();
        expect(entity.getLastDewormingExternal()).toBeNull();
        expect(entity.getOtherPreventiveNotes()).toBeNull();
    });

    it("should throw PetBackgroundIdNotFoundException if id is missing", () => {
        expect(() => {
            PetBackgroundEntity.create({
                id: "",
                petId: "pet-1",
            });
        }).toThrow(PetBackgroundIdNotFoundException);
    });

    it("should throw PetIdNotFoundException if petId is missing", () => {
        expect(() => {
            PetBackgroundEntity.create({
                id: "bg-1",
                petId: "",
            });
        }).toThrow(PetIdNotFoundException);
    });

    it("should update details and refresh updatedAt", () => {
        const entity = PetBackgroundEntity.create({
            id: "bg-1",
            petId: "pet-1",
            isNeutered: false,
        });

        const initialUpdatedAt = entity.getUpdatedAt();

        entity.updateDetails({
            isNeutered: true,
            neuteredDate: new Date("2025-02-01"),
            dietType: "BARF",
            hasAllergies: true,
            allergiesDescription: "Polen",
        });

        expect(entity.getIsNeutered()).toBe(true);
        expect(entity.getNeuteredDate()).toEqual(new Date("2025-02-01"));
        expect(entity.getDietType()).toBe("BARF");
        expect(entity.getHasAllergies()).toBe(true);
        expect(entity.getAllergiesDescription()).toBe("Polen");
        expect(entity.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(initialUpdatedAt.getTime());
    });
});
