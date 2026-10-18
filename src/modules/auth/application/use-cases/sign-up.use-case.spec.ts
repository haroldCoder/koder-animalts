import { Test, TestingModule } from "@nestjs/testing";
import { SignUpUseCase } from "./sign-up.use-case";
import { EmailAlreadyExistsException } from "@auth/domain/exceptions";
import { UserEntity } from "@auth/domain/entities";
import { UserRole } from "@user/domain/enums";

describe("SignUpUseCase", () => {
    let useCase: SignUpUseCase;
    let mockAuthRepository: any;
    let mockTokenService: any;

    beforeEach(async () => {
        mockAuthRepository = {
            findUserByEmail: jest.fn(),
            upsertUser: jest.fn(),
            createAccount: jest.fn(),
            createSession: jest.fn(),
            createOwnerProfile: jest.fn(),
            createVeterinarianProfile: jest.fn(),
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
                SignUpUseCase,
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

        useCase = module.get<SignUpUseCase>(SignUpUseCase);
    });

    it("should be defined", () => {
        expect(useCase).toBeDefined();
    });

    it("should register user successfully and return access and refresh tokens", async () => {
        const params = {
            email: "test@example.com",
            name: "Test User",
            password: "password123",
            image: "image.png",
        };

        mockAuthRepository.findUserByEmail.mockResolvedValue(null);
        mockAuthRepository.upsertUser.mockResolvedValue(
            UserEntity.create({ id: "user-123", email: params.email, name: params.name, image: params.image })
        );
        mockAuthRepository.createAccount.mockResolvedValue({});
        mockAuthRepository.createSession.mockResolvedValue({});

        const result = await useCase.execute(params);

        expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(params.email);
        expect(mockAuthRepository.upsertUser).toHaveBeenCalledWith(params.email, params.name, params.image);
        expect(mockAuthRepository.createAccount).toHaveBeenCalledWith(expect.objectContaining({
            userId: "user-123",
            providerId: "credentials",
            accountId: params.email,
        }));
        expect(mockTokenService.generateTokens).toHaveBeenCalledWith(expect.objectContaining({
            sub: "user-123",
            email: params.email,
        }));
        expect(mockAuthRepository.createSession).toHaveBeenCalledWith(expect.objectContaining({
            userId: "user-123",
            token: "mock-refresh-token",
        }));
        expect(result.statusCode).toBe(201);
        expect(result.data?.accessToken).toBe("mock-access-token");
        expect(result.data?.refreshToken).toBe("mock-refresh-token");
    });

    it("should register owner successfully with owner profile", async () => {
        const params = {
            email: "owner@example.com",
            name: "Owner User",
            password: "password123",
            role: UserRole.OWNER,
            phone: "+573001234567",
            address: "Calle 100",
        };

        mockAuthRepository.findUserByEmail.mockResolvedValue(null);
        mockAuthRepository.upsertUser.mockResolvedValue(
            UserEntity.create({ id: "owner-user-1", email: params.email, name: params.name })
        );
        mockAuthRepository.createAccount.mockResolvedValue({});
        mockAuthRepository.createOwnerProfile.mockResolvedValue("owner-profile-1");
        mockAuthRepository.createSession.mockResolvedValue({});

        const result = await useCase.execute(params);

        expect(mockAuthRepository.createOwnerProfile).toHaveBeenCalledWith("owner-user-1", {
            phone: "+573001234567",
            address: "Calle 100",
        });
        expect(mockTokenService.generateTokens).toHaveBeenCalledWith(expect.objectContaining({
            sub: "owner-user-1",
            role: UserRole.OWNER,
            ownerId: "owner-profile-1",
        }));
        expect(result.data?.user.role).toBe(UserRole.OWNER);
        expect(result.data?.user.ownerId).toBe("owner-profile-1");
        expect(result.data?.user.userId).toBe("owner-user-1");
    });

    it("should throw EmailAlreadyExistsException if email is already registered", async () => {
        const params = {
            email: "existing@example.com",
            name: "Test User",
            password: "password123",
        };

        mockAuthRepository.findUserByEmail.mockResolvedValue(
            UserEntity.create({ id: "user-123", email: params.email })
        );

        await expect(useCase.execute(params)).rejects.toThrow(EmailAlreadyExistsException);
    });
});
