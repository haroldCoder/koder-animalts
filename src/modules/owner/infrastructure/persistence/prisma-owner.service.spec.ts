import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { PrismaOwnerService } from "./prisma-owner.service";
import { OwnerEntity } from "@owner/domain/entities";
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
        const ownerEntity = OwnerEntity.create({
            id: "owner-123",
            address: "Street 123",
            phone: "123456789",
            userId: "user-123",
        });

        it("should create owner and return id when user does not already exist", async () => {
            mockPrismaService.owner.findUnique.mockResolvedValueOnce(null);
            mockPrismaService.owner.create.mockResolvedValueOnce({ id: "owner-123" });

            const result = await service.create(ownerEntity);

            expect(prisma.owner.findUnique).toHaveBeenCalledWith({
                where: { userId: ownerEntity.getUserId() },
            });
            expect(prisma.owner.create).toHaveBeenCalledWith({
                data: {
                    id: ownerEntity.getId(),
                    address: ownerEntity.getAddress(),
                    phone: ownerEntity.getPhone(),
                    userId: ownerEntity.getUserId(),
                },
            });
            expect(result).toBe("owner-123");
        });

        it("should throw OwnerAlreadyExistException if owner already exists", async () => {
            mockPrismaService.owner.findUnique.mockResolvedValueOnce({ id: "existing" });

            await expect(service.create(ownerEntity)).rejects.toThrow(OwnerAlreadyExistException);
            expect(prisma.owner.create).not.toHaveBeenCalled();
        });
    });

    describe("findByUserId", () => {
        it("should return an OwnerEntity when owner is found", async () => {
            const mockDbOwner = {
                id: "owner-123",
                userId: "user-123",
                address: "Street 123",
                phone: "123456789",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrismaService.owner.findUnique.mockResolvedValue(mockDbOwner);

            const result = await service.findByUserId("user-123");

            expect(prisma.owner.findUnique).toHaveBeenCalledWith({
                where: { userId: "user-123" },
            });
            expect(result).toBeInstanceOf(OwnerEntity);
            expect(result?.getId()).toBe("owner-123");
            expect(result?.getAddress()).toBe("Street 123");
            expect(result?.getPhone()).toBe("123456789");
        });

        it("should return null if owner not found", async () => {
            mockPrismaService.owner.findUnique.mockResolvedValue(null);

            const result = await service.findByUserId("non-existent");

            expect(result).toBeNull();
        });
    });
});
