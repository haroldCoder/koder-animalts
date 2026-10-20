import { HttpStatus } from "@nestjs/common";
import { GetPetBackgroundUseCase } from "./get-pet-background.use-case";
import { IPetRepository } from "@pet/domain/ports";
import { PetBackgroundEntity } from "@pet/domain/entities";
import { PetIdNotFoundException } from "@/common/domain/exceptions";
import { PetBackgroundAccessDeniedException } from "@pet/domain/exceptions";

describe("GetPetBackgroundUseCase", () => {
    let useCase: GetPetBackgroundUseCase;
    let mockRepository: jest.Mocked<IPetRepository>;

    const mockBackground = PetBackgroundEntity.create({
        id: "bg-1",
        petId: "pet-1",
        dietType: "croquetas",
        isNeutered: true,
    });

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

        useCase = new GetPetBackgroundUseCase(mockRepository);
    });

    it("should throw PetIdNotFoundException when petId is not provided", async () => {
        await expect(useCase.execute("")).rejects.toThrow(PetIdNotFoundException);
    });

    it("should validate access if userId is provided and throw PetBackgroundAccessDeniedException if denied", async () => {
        mockRepository.validateUserAccessToPet.mockResolvedValue(false);

        await expect(useCase.execute("pet-1", "user-unauthorized")).rejects.toThrow(
            PetBackgroundAccessDeniedException
        );
        expect(mockRepository.validateUserAccessToPet).toHaveBeenCalledWith("user-unauthorized", "pet-1");
    });

    it("should return background when userId has access", async () => {
        mockRepository.validateUserAccessToPet.mockResolvedValue(true);
        mockRepository.findBackgroundByPetId.mockResolvedValue(mockBackground);

        const result = await useCase.execute("pet-1", "user-owner");

        expect(result.statusCode).toBe(HttpStatus.OK);
        expect(result.data).toEqual(mockBackground.toPrimitives());
    });

    it("should return background without userId check if userId is not provided", async () => {
        mockRepository.findBackgroundByPetId.mockResolvedValue(mockBackground);

        const result = await useCase.execute("pet-1");

        expect(mockRepository.validateUserAccessToPet).not.toHaveBeenCalled();
        expect(result.statusCode).toBe(HttpStatus.OK);
        expect(result.data).toEqual(mockBackground.toPrimitives());
    });

    it("should return null data when pet has no background yet", async () => {
        mockRepository.findBackgroundByPetId.mockResolvedValue(null);

        const result = await useCase.execute("pet-1");

        expect(result.statusCode).toBe(HttpStatus.OK);
        expect(result.data).toBeNull();
    });
});
