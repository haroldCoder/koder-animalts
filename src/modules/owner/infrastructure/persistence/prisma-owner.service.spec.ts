import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { PrismaOwnerService } from "./prisma-owner.service";
import { OwnerAlreadyExistException } from "@owner/domain/exceptions";

describe("PrismaOwnerService", () => {
    let service: PrismaOwnerService;
    let prisma: PrismaService;

    const mockPrismaService = {
        owner: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PrismaOwnerService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<PrismaOwnerService>(PrismaOwnerService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should call prisma.owner.create with correct data after checking existence", async () => {
            const ownerData = {
                address: "Street 123",
                phone: "123456789",
                userId: "user-123",
            };
            const mockOwner = { id: "owner-123", ...ownerData };

            mockPrismaService.owner.findUnique.mockResolvedValueOnce(null);
            mockPrismaService.owner.create.mockResolvedValueOnce(mockOwner);

            const result = await service.create(ownerData);

            expect(prisma.owner.findUnique).toHaveBeenCalledWith({
                where: { userId: ownerData.userId },
            });
            expect(prisma.owner.create).toHaveBeenCalledWith({
                data: ownerData,
            });
            expect(result).toEqual(mockOwner.id);
        });

        it("should throw OwnerAlreadyExistException if owner already exists", async () => {
            const ownerData = {
                address: "Street 123",
                phone: "123456789",
                userId: "user-123",
            };
            mockPrismaService.owner.findUnique.mockResolvedValueOnce({ id: "existing" });

            await expect(service.create(ownerData)).rejects.toThrow(OwnerAlreadyExistException);
        });
    });

    describe("findByUserId", () => {
        it("should call prisma.owner.findUnique with correct data", async () => {
            const userId = "user-123";
            const mockOwner = { id: "owner-123", userId, address: "Street 123", phone: "123456789" };

            mockPrismaService.owner.findUnique.mockResolvedValue(mockOwner);

            const result = await service.findByUserId(userId);

            expect(prisma.owner.findUnique).toHaveBeenCalledWith({
                where: { userId },
            });
            expect(result).toEqual(mockOwner);
        });

        it("should return null if owner not found", async () => {
            const userId = "non-existent";
            mockPrismaService.owner.findUnique.mockResolvedValue(null);

            const result = await service.findByUserId(userId);

            expect(result).toBeNull();
        });
    });
});
