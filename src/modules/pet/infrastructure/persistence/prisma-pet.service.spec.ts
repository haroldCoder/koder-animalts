import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { PrismaPetService } from "./prisma-pet.service";
import { GenderPet } from "@pet/domain/enums";
import { PetEntity, PetBackgroundEntity } from "@pet/domain/entities";
import { PrismaVeterinarianService } from "@veterinarian/infrastructure";
import { PetIdNotExistException, PetIdNotFoundException } from "@/common/domain/exceptions";
import { ClinicIdNotFoundException } from "@veterinarian/domain/exceptions";
import { ClinicNotExistException } from "@veterinary-clinics/domain/exceptions";

describe("PrismaPetService", () => {
    let service: PrismaPetService;
    let prisma: PrismaService;

    const mockPrismaService = {
        pet: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
        },
        owner: {
            findFirst: jest.fn(),
        },
        veterinaryClinic: {
            findUnique: jest.fn(),
        },
        petBackground: {
            findUnique: jest.fn(),
            upsert: jest.fn(),
        },
        user: {
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PrismaPetService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: PrismaVeterinarianService,
                    useValue: {
                        findByIdWithDetails: jest.fn(),
                    },
                }
            ],
        }).compile();

        service = module.get<PrismaPetService>(PrismaPetService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findOwnerIdByUserId", () => {
        it("should return owner id if found", async () => {
            mockPrismaService.owner.findFirst.mockResolvedValue({ id: "owner-123" });
            const result = await service.findOwnerIdByUserId("user-123");
            expect(result).toBe("owner-123");
            expect(prisma.owner.findFirst).toHaveBeenCalledWith({
                where: { userId: "user-123" }
            });
        });

        it("should return null if not found", async () => {
            mockPrismaService.owner.findFirst.mockResolvedValue(null);
            const result = await service.findOwnerIdByUserId("user-123");
            expect(result).toBeNull();
        });
    });

    describe("create", () => {
        it("should call prisma.pet.create and return id", async () => {
            const pet = PetEntity.create({
                id: "pet-123",
                name: "Buddy",
                species: "Dog",
                gender: GenderPet.MALE,
                mainImage: "image.jpg",
                ownerId: "owner-123",
                clinicId: "clinic-123",
            });
            const mockPet = {
                id: pet.getId(),
                name: pet.getName(),
                species: pet.getSpecies(),
                gender: pet.getGender(),
                mainImage: pet.getMainImage(),
                ownerId: pet.getOwnerId(),
                clinicId: pet.getClinicId(),
            };

            mockPrismaService.pet.create.mockResolvedValue(mockPet);

            const result = await service.create(pet);

            expect(prisma.pet.create).toHaveBeenCalledWith({
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
                },
            });
            expect(result).toBe(mockPet.id);
        });
    });

    describe("update", () => {
        it("should call prisma.pet.update and return updated id", async () => {
            const pet = PetEntity.create({
                id: "pet-123",
                name: "Max",
                species: "Dog",
                gender: GenderPet.MALE,
                mainImage: "image.jpg",
                ownerId: "owner-123",
                clinicId: "clinic-123",
            });
            const mockPet = { id: pet.getId(), name: "Max" };

            mockPrismaService.pet.update.mockResolvedValue(mockPet);

            const result = await service.update(pet);

            expect(prisma.pet.update).toHaveBeenCalledWith({
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
                },
            });
            expect(result).toBe(pet.getId());
        });
    });

    describe("delete", () => {
        it("should call prisma.pet.delete", async () => {
            const id = "pet-123";
            mockPrismaService.pet.delete.mockResolvedValue({ id });

            await service.delete(id);

            expect(prisma.pet.delete).toHaveBeenCalledWith({
                where: { id },
            });
        });
    });

    describe("findById", () => {
        it("should call prisma.pet.findUnique and return pet entity", async () => {
            const id = "pet-123";
            const mockPet = {
                id,
                name: "Buddy",
                species: "Dog",
                gender: "MALE",
                mainImage: "image.jpg",
                ownerId: "owner-123",
                clinicId: "clinic-123",
                breed: null,
                birthDate: null,
                weight: null,
                color: null,
                microchip: null,
                isActive: true,
                iaImage: null,
                images: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrismaService.pet.findUnique.mockResolvedValue(mockPet);

            const result = await service.findById(id);

            expect(prisma.pet.findUnique).toHaveBeenCalledWith({
                where: { id },
            });
            expect(result).toBeInstanceOf(PetEntity);
            expect(result?.getId()).toBe(id);
            expect(result?.getName()).toBe("Buddy");
            expect(result?.getGender()).toBe(GenderPet.MALE);
        });

        it("should return null if pet not found", async () => {
            const id = "non-existent";
            mockPrismaService.pet.findUnique.mockResolvedValue(null);

            const result = await service.findById(id);

            expect(result).toBeNull();
        });
    });

    describe("updateClinic", () => {
        it("should throw PetIdNotFoundException if petId is empty", async () => {
            await expect(service.updateClinic("", "clinic-123")).rejects.toThrow(
                PetIdNotFoundException
            );
        });

        it("should throw ClinicIdNotFoundException if clinicId is empty", async () => {
            await expect(service.updateClinic("pet-123", "")).rejects.toThrow(
                ClinicIdNotFoundException
            );
        });

        it("should throw ClinicNotExistException if clinic is not found", async () => {
            mockPrismaService.veterinaryClinic.findUnique.mockResolvedValue(null);

            await expect(service.updateClinic("pet-123", "clinic-123")).rejects.toThrow(
                ClinicNotExistException
            );
            expect(prisma.veterinaryClinic.findUnique).toHaveBeenCalledWith({
                where: { id: "clinic-123" }
            });
        });

        it("should throw PetIdNotExistException if pet is not found", async () => {
            mockPrismaService.veterinaryClinic.findUnique.mockResolvedValue({ id: "clinic-123" });
            mockPrismaService.pet.findUnique.mockResolvedValue(null);

            await expect(service.updateClinic("pet-123", "clinic-123")).rejects.toThrow(
                PetIdNotExistException
            );
            expect(prisma.pet.findUnique).toHaveBeenCalledWith({
                where: { id: "pet-123" }
            });
        });

        it("should update pet with new clinicId when clinic and pet exist", async () => {
            mockPrismaService.veterinaryClinic.findUnique.mockResolvedValue({ id: "clinic-123" });
            mockPrismaService.pet.findUnique.mockResolvedValue({ id: "pet-123" });
            mockPrismaService.pet.update.mockResolvedValue({ id: "pet-123", clinicId: "clinic-123" });

            await service.updateClinic("pet-123", "clinic-123");

            expect(prisma.veterinaryClinic.findUnique).toHaveBeenCalledWith({
                where: { id: "clinic-123" }
            });
            expect(prisma.pet.findUnique).toHaveBeenCalledWith({
                where: { id: "pet-123" }
            });
            expect(prisma.pet.update).toHaveBeenCalledWith({
                where: { id: "pet-123" },
                data: { clinicId: "clinic-123" }
            });
        });
    });

    describe("findBackgroundByPetId", () => {
        it("should return background when pet and background exist", async () => {
            mockPrismaService.pet.findUnique.mockResolvedValue({ id: "pet-1" });
            mockPrismaService.petBackground.findUnique.mockResolvedValue({
                id: "bg-1",
                petId: "pet-1",
                dietType: "croquetas",
                isNeutered: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const result = await service.findBackgroundByPetId("pet-1");

            expect(result).not.toBeNull();
            expect(result?.getId()).toBe("bg-1");
            expect(result?.getPetId()).toBe("pet-1");
            expect(result?.getDietType()).toBe("croquetas");
        });

        it("should return null when pet exists but no background exists", async () => {
            mockPrismaService.pet.findUnique.mockResolvedValue({ id: "pet-1" });
            mockPrismaService.petBackground.findUnique.mockResolvedValue(null);

            const result = await service.findBackgroundByPetId("pet-1");

            expect(result).toBeNull();
        });

        it("should throw PetIdNotExistException when pet does not exist", async () => {
            mockPrismaService.pet.findUnique.mockResolvedValue(null);

            await expect(service.findBackgroundByPetId("non-existent")).rejects.toThrow(
                PetIdNotExistException
            );
        });
    });

    describe("upsertBackground", () => {
        it("should upsert background and return mapped entity", async () => {
            mockPrismaService.pet.findUnique.mockResolvedValue({ id: "pet-1" });
            mockPrismaService.petBackground.upsert.mockResolvedValue({
                id: "bg-1",
                petId: "pet-1",
                dietType: "BARF",
                isNeutered: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const entity = PetBackgroundEntity.create({
                id: "bg-1",
                petId: "pet-1",
                dietType: "BARF",
                isNeutered: true,
            });

            const result = await service.upsertBackground(entity);

            expect(mockPrismaService.petBackground.upsert).toHaveBeenCalled();
            expect(result.getId()).toBe("bg-1");
            expect(result.getDietType()).toBe("BARF");
        });
    });

    describe("validateUserAccessToPet", () => {
        it("should return true when user is the owner of the pet", async () => {
            mockPrismaService.pet.findUnique.mockResolvedValue({
                id: "pet-1",
                ownerId: "owner-1",
                clinicId: "clinic-1",
            });
            mockPrismaService.user.findUnique.mockResolvedValue({
                id: "user-1",
                owner: { id: "owner-1" },
                veterinarian: null,
            });

            const result = await service.validateUserAccessToPet("user-1", "pet-1");

            expect(result).toBe(true);
        });

        it("should return true when user is a veterinarian in the pet clinic", async () => {
            mockPrismaService.pet.findUnique.mockResolvedValue({
                id: "pet-1",
                ownerId: "owner-1",
                clinicId: "clinic-1",
            });
            mockPrismaService.user.findUnique.mockResolvedValue({
                id: "user-vet",
                owner: null,
                veterinarian: { clinicId: "clinic-1" },
            });

            const result = await service.validateUserAccessToPet("user-vet", "pet-1");

            expect(result).toBe(true);
        });

        it("should return false when user is neither the owner nor the clinic veterinarian", async () => {
            mockPrismaService.pet.findUnique.mockResolvedValue({
                id: "pet-1",
                ownerId: "owner-1",
                clinicId: "clinic-1",
            });
            mockPrismaService.user.findUnique.mockResolvedValue({
                id: "user-other",
                owner: { id: "owner-other" },
                veterinarian: { clinicId: "clinic-other" },
            });

            const result = await service.validateUserAccessToPet("user-other", "pet-1");

            expect(result).toBe(false);
        });
    });
});
