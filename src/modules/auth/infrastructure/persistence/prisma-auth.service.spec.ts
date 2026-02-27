import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { PrismaAuthService } from "./prisma-auth.service";
import { randomUUID } from "crypto";

describe("PrismaAuthService", () => {
    let service: PrismaAuthService;
    let prisma: PrismaService;

    const mockPrismaService = {
        user: {
            upsert: jest.fn(),
        },
        account: {
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        session: {
            create: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PrismaAuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<PrismaAuthService>(PrismaAuthService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("upsertUser", () => {
        it("should call prisma.user.upsert with correct data", async () => {
            const email = "test@example.com";
            const name = "Test User";
            const image = "image.png";
            const mockUser = { id: "1", email, name, image };

            mockPrismaService.user.upsert.mockResolvedValue(mockUser);

            const result = await service.upsertUser(email, name, image);

            expect(prisma.user.upsert).toHaveBeenCalledWith({
                where: { email },
                update: { name, image },
                create: { email, name, image },
            });
            expect(result).toEqual(mockUser);
        });

        it("should handle optional name and image as null", async () => {
            const email = "test@example.com";
            mockPrismaService.user.upsert.mockResolvedValue({ id: "1", email });

            await service.upsertUser(email);

            expect(prisma.user.upsert).toHaveBeenCalledWith({
                where: { email },
                update: { name: null, image: null },
                create: { email, name: null, image: null },
            });
        });
    });

    describe("findAccount", () => {
        it("should call prisma.account.findFirst with correct data", async () => {
            const providerId = "google";
            const accountId = "acc-123";
            const userId = "user-123";
            const mockAccount = { id: "1", providerId, accountId, userId };

            mockPrismaService.account.findFirst.mockResolvedValue(mockAccount);

            const result = await service.findAccount(providerId, accountId, userId);

            expect(prisma.account.findFirst).toHaveBeenCalledWith({
                where: { providerId, accountId, userId },
            });
            expect(result).toEqual(mockAccount);
        });
    });

    describe("createAccount", () => {
        it("should generate a UUID and call prisma.account.create", async () => {
            const accountData = {
                userId: "user-123",
                providerId: "google",
                accountId: "acc-123",
                accessToken: "token",
            };
            const mockAccount = { id: "uuid-123", ...accountData };

            mockPrismaService.account.create.mockResolvedValue(mockAccount);

            const result = await service.createAccount(accountData as any);

            expect(prisma.account.create).toHaveBeenCalledWith({
                data: expect.objectContaining(accountData),
            });
            expect(prisma.account.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ id: expect.any(String) }),
            });
            expect(result).toEqual(mockAccount);
        });
    });

    describe("updateAccount", () => {
        it("should call prisma.account.update with correct data", async () => {
            const id = "1";
            const data = { accessToken: "new-token" };
            const mockAccount = { id, ...data };

            mockPrismaService.account.update.mockResolvedValue(mockAccount);

            const result = await service.updateAccount(id, data);

            expect(prisma.account.update).toHaveBeenCalledWith({
                where: { id },
                data,
            });
            expect(result).toEqual(mockAccount);
        });
    });

    describe("createSession", () => {
        it("should generate a UUID and call prisma.session.create", async () => {
            const sessionData = {
                userId: "user-123",
                token: "session-token",
                expiresAt: new Date(),
            };
            const mockSession = { id: "uuid-456", ...sessionData };

            mockPrismaService.session.create.mockResolvedValue(mockSession);

            const result = await service.createSession(sessionData as any);

            expect(prisma.session.create).toHaveBeenCalledWith({
                data: expect.objectContaining(sessionData),
            });
            expect(prisma.session.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ id: expect.any(String) }),
            });
            expect(result).toEqual(mockSession);
        });
    });
});
