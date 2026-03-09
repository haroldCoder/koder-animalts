import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { PrismaVeterinarianService } from "./prisma-veterinarian.service";
import { VeterinarianIdNotExistException } from "@/common/domain/exceptions";
import { VeterinarianAlreadyExistsException } from "@veterinarian/domain/exceptions";

describe("PrismaVeterinarianService", () => {
    let service: PrismaVeterinarianService;
    let prisma: PrismaService;

    const mockPrismaService = {
        veterinarian: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PrismaVeterinarianService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<PrismaVeterinarianService>(PrismaVeterinarianService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should throw VeterinarianAlreadyExistsException if veterinarian already exists", async () => {
            const vetData = {
                specialty: "Surgery",
                phone: "987654321",
                userId: "user-123",
                clinicId: "clinic-123",
            };
            const mockVet = { id: "vet-123", ...vetData };

            mockPrismaService.veterinarian.findUnique.mockResolvedValueOnce(mockVet);

            await expect(service.create(vetData)).rejects.toThrow(VeterinarianAlreadyExistsException);
        });

        it("should create veterinarian if not exists", async () => {
            const vetData = {
                specialty: "Surgery",
                phone: "987654321",
                userId: "user-123",
                clinicId: "clinic-123",
            };
            const mockVet = { id: "vet-123", ...vetData };

            mockPrismaService.veterinarian.findUnique.mockResolvedValueOnce(null);
            mockPrismaService.veterinarian.create.mockResolvedValueOnce(mockVet);

            const result = await service.create(vetData);

            expect(result).toBe("vet-123");
        });
    });

    describe("findByIdWithDetails", () => {
        it("should call prisma.veterinarian.findUnique with correct include", async () => {
            const id = "vet-123";
            const mockVet = {
                id,
                specialty: "Surgery",
                phone: "987654321",
                userId: "user-123",
                clinicId: "clinic-123",
                user: { id: "user-123", name: "Dr. Smith", email: "smith@vet.com" },
                clinic: { id: "clinic-123", name: "Pet Clinic" },
            };

            mockPrismaService.veterinarian.findUnique.mockResolvedValue(mockVet);

            const result = await service.findByIdWithDetails(id);

            expect(prisma.veterinarian.findUnique).toHaveBeenCalledWith({
                where: { id },
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                    clinic: {
                        select: { id: true, name: true },
                    }
                }
            });
            expect(result).toEqual({
                ...mockVet,
                user: { ...mockVet.user, name: "Dr. Smith" }
            });
        });
    });

    describe("findByUserId", () => {
        it("should return null if veterinarian not found", async () => {
            const userId = "non-existent";
            mockPrismaService.veterinarian.findUnique.mockResolvedValue(null);

            const result = await service.findByUserId(userId);

            expect(result).toBeNull();
        });

        it("should return veterinarian with specialty default if found", async () => {
            const userId = "user-123";
            const mockVet = { id: "vet-123", userId, specialty: null };

            mockPrismaService.veterinarian.findUnique.mockResolvedValue(mockVet);

            const result = await service.findByUserId(userId);

            expect(result).toEqual({
                ...mockVet,
                specialty: ""
            });
        });
    });

    describe("findClinicByVeterinarianId", () => {
        it("should call prisma.veterinarian.findUnique with correct select", async () => {
            const veterinarianId = "vet-123";
            const mockClinic = { id: "clinic-123", name: "Pet Clinic" };

            mockPrismaService.veterinarian.findUnique.mockResolvedValue({
                clinic: mockClinic,
            });

            const result = await service.findClinicByVeterinarianId(veterinarianId);

            expect(prisma.veterinarian.findUnique).toHaveBeenCalledWith({
                where: { id: veterinarianId },
                select: {
                    clinic: {
                        select: { id: true, name: true }
                    }
                }
            });
            expect(result).toEqual(mockClinic);
        });
    });
});
