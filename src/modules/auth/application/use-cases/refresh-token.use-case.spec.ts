import { Test, TestingModule } from "@nestjs/testing";
import { RefreshTokenUseCase } from "./refresh-token.use-case";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { SessionEntity } from "@auth/domain/entities";
import { UserRole } from "@user/domain/enums";

describe("RefreshTokenUseCase", () => {
    let useCase: RefreshTokenUseCase;
    let mockAuthRepository: any;
    let mockTokenService: any;

    beforeEach(async () => {
        mockAuthRepository = {
            findSessionByToken: jest.fn(),
            findUserRoleInfo: jest.fn(),
            updateSessionToken: jest.fn(),
        };

        mockTokenService = {
            verifyRefreshToken: jest.fn(),
            generateTokens: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RefreshTokenUseCase,
                {
                    provide: "IAuthRepository",
                    useValue: mockAuthRepository,
                },
                {
                    provide: "ITokenService",
                    useValue: mockTokenService,
                },
            ],
        }).compile();

        useCase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
    });

    it("should be defined", () => {
        expect(useCase).toBeDefined();
    });

    it("should throw BadRequestException if refreshToken is missing", async () => {
        await expect(useCase.execute({ refreshToken: "" })).rejects.toThrow(BadRequestException);
    });

    it("should throw UnauthorizedException if session not found", async () => {
        mockTokenService.verifyRefreshToken.mockResolvedValue({ sub: "user-1", type: "refresh" });
        mockAuthRepository.findSessionByToken.mockResolvedValue(null);

        await expect(useCase.execute({ refreshToken: "invalid-token" })).rejects.toThrow(UnauthorizedException);
    });

    it("should refresh tokens successfully and rotate session token", async () => {
        const oldRefreshToken = "old-refresh-token";
        const session = SessionEntity.create({
            id: "session-1",
            userId: "user-1",
            token: oldRefreshToken,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60), // not expired
        });

        mockTokenService.verifyRefreshToken.mockResolvedValue({ sub: "user-1", type: "refresh" });
        mockAuthRepository.findSessionByToken.mockResolvedValue(session);
        mockAuthRepository.findUserRoleInfo.mockResolvedValue({
            id: "user-1",
            email: "test@example.com",
            name: "Test",
            image: null,
            role: UserRole.VETERINARIAN,
            veterinarianId: "vet-1",
            clinicId: "clinic-1",
        });
        mockTokenService.generateTokens.mockResolvedValue({
            accessToken: "new-access-token",
            refreshToken: "new-refresh-token",
        });
        mockAuthRepository.updateSessionToken.mockResolvedValue({});

        const result = await useCase.execute({ refreshToken: oldRefreshToken });

        expect(mockAuthRepository.findSessionByToken).toHaveBeenCalledWith(oldRefreshToken);
        expect(mockTokenService.generateTokens).toHaveBeenCalledWith(expect.objectContaining({
            sub: "user-1",
            role: UserRole.VETERINARIAN,
            clinicId: "clinic-1",
        }));
        expect(mockAuthRepository.updateSessionToken).toHaveBeenCalledWith("session-1", "new-refresh-token", expect.any(Date));
        expect(result.statusCode).toBe(200);
        expect(result.data?.accessToken).toBe("new-access-token");
        expect(result.data?.refreshToken).toBe("new-refresh-token");
        expect(result.data?.user.role).toBe(UserRole.VETERINARIAN);
    });
});
