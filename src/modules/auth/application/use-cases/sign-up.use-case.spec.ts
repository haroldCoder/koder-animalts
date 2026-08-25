import { Test, TestingModule } from "@nestjs/testing";
import { SignUpUseCase } from "./sign-up.use-case";
import { EmailAlreadyExistsException } from "@auth/domain/exceptions";
import { UserEntity } from "@auth/domain/entities";

describe("SignUpUseCase", () => {
    let useCase: SignUpUseCase;
    let mockAuthRepository: any;

    beforeEach(async () => {
        mockAuthRepository = {
            findUserByEmail: jest.fn(),
            upsertUser: jest.fn(),
            createAccount: jest.fn(),
            createSession: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SignUpUseCase,
                {
                    provide: "IAuthRepository",
                    useValue: mockAuthRepository,
                },
            ],
        }).compile();

        useCase = module.get<SignUpUseCase>(SignUpUseCase);
    });

    it("should be defined", () => {
        expect(useCase).toBeDefined();
    });

    it("should register user successfully and create session", async () => {
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
        expect(mockAuthRepository.createSession).toHaveBeenCalledWith(expect.objectContaining({
            userId: "user-123",
        }));
        expect(result.statusCode).toBe(201);
        expect(result.data).toBeDefined();
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
