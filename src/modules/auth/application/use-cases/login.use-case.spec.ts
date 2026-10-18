import { Test, TestingModule } from "@nestjs/testing";
import { LoginUseCase } from "./login.use-case";
import { InvalidCredentialsException } from "@auth/domain/exceptions";
import { hashPassword } from "@auth/infrastructure/utils/hash.utils";
import { AccountEntity, UserEntity } from "@auth/domain/entities";
import { UserRole } from "@user/domain/enums";

describe("LoginUseCase", () => {
    let useCase: LoginUseCase;
    let mockAuthRepository: any;
    let mockTokenService: any;

    beforeEach(async () => {
        mockAuthRepository = {
            findUserByEmail: jest.fn(),
            findAccount: jest.fn(),
            createSession: jest.fn(),
            findUserRoleInfo: jest.fn(),
        };

        mockTokenService = {
            generateTokens: jest.fn().mockResolvedValue({
                accessToken: "mock-access-token",
                refreshToken: "mock-refresh-token",
            }),
            verifyAccessToken: jest.fn(),
            verifyRefreshToken: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginUseCase,
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

        useCase = module.get<LoginUseCase>(LoginUseCase);
    });

    it("should be defined", () => {
        expect(useCase).toBeDefined();
    });

    it("should verify credentials, issue access & refresh token, and login user successfully", async () => {
        const password = "password123";
        const hashedPassword = hashPassword(password);
        const params = {
            email: "test@example.com",
            password,
        };

        mockAuthRepository.findUserByEmail.mockResolvedValue(
            UserEntity.create({ id: "user-123", email: params.email })
        );
        mockAuthRepository.findAccount.mockResolvedValue(
            AccountEntity.create({
                id: "acc-123",
                userId: "user-123",
                providerId: "credentials",
                accountId: params.email,
                password: hashedPassword,
            })
        );
        mockAuthRepository.findUserRoleInfo.mockResolvedValue({
            id: "user-123",
            userId: "user-123",
            email: params.email,
            name: "Test",
            image: null,
            role: UserRole.OWNER,
            ownerId: "owner-123",
        });
        mockAuthRepository.createSession.mockResolvedValue({});

        const result = await useCase.execute(params);

        expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(params.email);
        expect(mockAuthRepository.findAccount).toHaveBeenCalledWith("credentials", params.email, "user-123");
        expect(mockTokenService.generateTokens).toHaveBeenCalledWith(expect.objectContaining({
            sub: "user-123",
            role: UserRole.OWNER,
        }));
        expect(mockAuthRepository.createSession).toHaveBeenCalledWith(expect.objectContaining({
            userId: "user-123",
            token: "mock-refresh-token",
        }));
        expect(result.statusCode).toBe(200);
        expect(result.data?.accessToken).toBe("mock-access-token");
        expect(result.data?.refreshToken).toBe("mock-refresh-token");
        expect(result.data?.user.userId).toBe("user-123");
        expect(result.data?.user.role).toBe(UserRole.OWNER);
    });

    it("should throw InvalidCredentialsException if user is not found", async () => {
        const params = {
            email: "nonexistent@example.com",
            password: "password123",
        };

        mockAuthRepository.findUserByEmail.mockResolvedValue(null);

        await expect(useCase.execute(params)).rejects.toThrow(InvalidCredentialsException);
    });

    it("should throw InvalidCredentialsException if password is incorrect", async () => {
        const params = {
            email: "test@example.com",
            password: "wrongpassword",
        };

        mockAuthRepository.findUserByEmail.mockResolvedValue(
            UserEntity.create({ id: "user-123", email: params.email })
        );
        mockAuthRepository.findAccount.mockResolvedValue(
            AccountEntity.create({
                id: "acc-123",
                userId: "user-123",
                providerId: "credentials",
                accountId: params.email,
                password: hashPassword("correctpassword"),
            })
        );

        await expect(useCase.execute(params)).rejects.toThrow(InvalidCredentialsException);
    });
});
