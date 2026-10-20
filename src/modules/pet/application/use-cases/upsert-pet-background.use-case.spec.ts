import { HttpStatus } from "@nestjs/common";
import { UpsertPetBackgroundUseCase } from "./upsert-pet-background.use-case";
import { IPetRepository } from "@pet/domain/ports";
import { PetBackgroundEntity } from "@pet/domain/entities";
import { PetIdNotFoundException } from "@/common/domain/exceptions";
import { PetBackgroundAccessDeniedException } from "@pet/domain/exceptions";

describe("UpsertPetBackgroundUseCase", () => {
    let useCase: UpsertPetBackgroundUseCase;
    let mockRepository: jest.Mocked<IPetRepository>;
    const mockIdGenerator = jest.fn().mockReturnValue("generated-bg-uuid");

    beforeEach(() => {
        mockRepository = {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findById: jest.fn(),
            findByVeterinarianId: jest.fn(),
            findByOwnerId: jest.fn(),
            findByOwnerUserId: jest.fn(),
            findByVeterinarianUserId: jest.fn(),
            findOwnerIdByUserId: jest.fn(),
            updateClinic: jest.fn(),
            findBackgroundByPetId: jest.fn(),
            upsertBackground: jest.fn(),
            validateUserAccessToPet: jest.fn(),
        } as unknown as jest.Mocked<IPetRepository>;

        useCase = new UpsertPetBackgroundUseCase(mockRepository, mockIdGenerator);
    });

    it("should throw PetIdNotFoundException when petId is empty", async () => {
        await expect(useCase.execute("", {})).rejects.toThrow(PetIdNotFoundException);
    });

    it("should check access if userId is provided and throw if access denied", async () => {
        mockRepository.validateUserAccessToPet.mockResolvedValue(false);

        await expect(
            useCase.execute("pet-1", { dietType: "croquetas" }, "user-unauthorized")
        ).rejects.toThrow(PetBackgroundAccessDeniedException);

        expect(mockRepository.validateUserAccessToPet).toHaveBeenCalledWith(
            "user-unauthorized",
            "pet-1"
        );
    });

    it("should create new background when no existing background is found", async () => {
        mockRepository.findBackgroundByPetId.mockResolvedValue(null);
        mockRepository.upsertBackground.mockImplementation(async (bg) => bg);

        const dto = {
            provenance: "Criadero",
            dietType: "BARF",
            isNeutered: true,
        };

        const result = await useCase.execute("pet-1", dto);

        expect(mockRepository.findBackgroundByPetId).toHaveBeenCalledWith("pet-1");
        expect(mockRepository.upsertBackground).toHaveBeenCalled();
        expect(result.statusCode).toBe(HttpStatus.OK);
        expect(result.message).toBe("Pet background created successfully");
        expect(result.data.petId).toBe("pet-1");
        expect(result.data.dietType).toBe("BARF");
        expect(result.data.diet).toBe("BARF");
    });

    it("should update existing background when background already exists", async () => {
        const existing = PetBackgroundEntity.create({
            id: "bg-existing",
            petId: "pet-1",
            dietType: "concentrado",
            isNeutered: false,
        });

        mockRepository.findBackgroundByPetId.mockResolvedValue(existing);
        mockRepository.upsertBackground.mockImplementation(async (bg) => bg);

        const dto = {
            dietType: "casera",
            isNeutered: true,
        };

        const result = await useCase.execute("pet-1", dto);

        expect(mockRepository.upsertBackground).toHaveBeenCalledWith(existing);
        expect(result.statusCode).toBe(HttpStatus.OK);
        expect(result.message).toBe("Pet background updated successfully");
        expect(result.data.dietType).toBe("casera");
        expect(result.data.isNeutered).toBe(true);
    });

    it("should handle frontend payload with diet, canineVaccines, felineVaccines and deworming", async () => {
        mockRepository.findBackgroundByPetId.mockResolvedValue(null);
        mockRepository.upsertBackground.mockImplementation(async (bg) => bg);

        const dto = {
            diet: "Concentrado",
            canineVaccines: { rabies: true, parvovirus: false },
            felineVaccines: { rabies: false },
            deworming: {
                internalParasites: false,
                lastInternalDewormingDate: "",
            },
            isNeutered: true,
            otherVaccinesNotes: "Aplicar refuerzo en 6 meses",
        };

        const result = await useCase.execute("pet-1", dto);

        expect(result.statusCode).toBe(HttpStatus.OK);
        expect(result.data.diet).toBe("Concentrado");
        expect(result.data.dietType).toBe("Concentrado");
        expect(result.data.canineVaccines).toEqual({ rabies: true, parvovirus: false });
        expect(result.data.lastDewormingInternal).toBeNull();
        expect(result.data.otherVaccinesNotes).toBe("Aplicar refuerzo en 6 meses");
        expect(result.data.otherPreventiveNotes).toBe("Aplicar refuerzo en 6 meses");
    });
});
