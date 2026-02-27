import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { PrismaPetService } from "./prisma-pet.service";
import { GenderPet } from "@pet/domain/enums";

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
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PrismaPetService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
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

    describe("create", () => {
        it("should call prisma.pet.create and return id", async () => {
            const petData = {
                name: "Buddy",
                species: "Dog",
                gender: GenderPet.MALE,
                mainImage: "image.jpg",
                ownerId: "owner-123",
                clinicId: "clinic-123",
            };
            const mockPet = { id: "pet-123", ...petData };

            mockPrismaService.pet.create.mockResolvedValue(mockPet);

            const result = await service.create(petData as any);

            expect(prisma.pet.create).toHaveBeenCalledWith({
                data: petData,
            });
            expect(result).toBe(mockPet.id);
        });
    });

    describe("update", () => {
        it("should call prisma.pet.update and return updated id", async () => {
            const id = "pet-123";
            const updateData = { name: "Max" };
            const mockPet = { id, name: "Max" };

            mockPrismaService.pet.update.mockResolvedValue(mockPet);

            const result = await service.update(id, updateData);

            expect(prisma.pet.update).toHaveBeenCalledWith({
                where: { id },
                data: updateData,
            });
            expect(result).toBe(id);
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
        it("should call prisma.pet.findUnique and return pet model with gender cast", async () => {
            const id = "pet-123";
            const mockPet = {
                id,
                name: "Buddy",
                species: "Dog",
                gender: "MALE", // String from DB
                mainImage: "image.jpg",
                ownerId: "owner-123",
                clinicId: "clinic-123",
                breed: null,
                birthDate: null,
                weight: null,
            };

            mockPrismaService.pet.findUnique.mockResolvedValue(mockPet);

            const result = await service.findById(id);

            expect(prisma.pet.findUnique).toHaveBeenCalledWith({
                where: { id },
            });
            expect(result).toEqual({
                ...mockPet,
                gender: GenderPet.MALE,
            });
        });

        it("should return null if pet not found", async () => {
            const id = "non-existent";
            mockPrismaService.pet.findUnique.mockResolvedValue(null);

            const result = await service.findById(id);

            expect(result).toBeNull();
        });
    });
});
