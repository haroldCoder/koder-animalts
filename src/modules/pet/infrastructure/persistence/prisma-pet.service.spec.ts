import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { PrismaPetService } from "./prisma-pet.service";
import { GenderPet } from "@pet/domain/enums";
import { PetEntity } from "@pet/domain/entities";
import { PrismaVeterinarianService } from "@veterinarian/infrastructure";

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
});
