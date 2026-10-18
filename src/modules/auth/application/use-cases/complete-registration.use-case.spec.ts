import { Test, TestingModule } from "@nestjs/testing";
import { CompleteRegistrationUseCase } from "./complete-registration.use-case";
import { UserRole } from "@user/domain/enums";
import { UserNotExistException } from "@/common/domain/exceptions";
import { BadRequestException } from "@nestjs/common";

describe("CompleteRegistrationUseCase", () => {
    let useCase: CompleteRegistrationUseCase;
    let mockAuthRepository: any;
    let mockTokenService: any;

    beforeEach(async () => {
        mockAuthRepository = {
            findUserRoleInfo: jest.fn(),
            createOwnerProfile: jest.fn(),
            createVeterinarianProfile: jest.fn(),
            createSession: jest.fn(),
        };

        mockTokenService = {
            generateTokens: jest.fn().mockResolvedValue({
                accessToken: "new-access-token",
                refreshToken: "new-refresh-token",
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompleteRegistrationUseCase,
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

        useCase = module.get<CompleteRegistrationUseCase>(CompleteRegistrationUseCase);
    });

    it("should be defined", () => {
        expect(useCase).toBeDefined();
    });

    it("should complete registration for OWNER successfully", async () => {
        const userId = "user-123";
        mockAuthRepository.findUserRoleInfo
            .mockResolvedValueOnce({
                id: userId,
                email: "owner@test.com",
                name: "Owner Test",
                role: UserRole.UNKNOWN,
            })
            .mockResolvedValueOnce({
                id: userId,
                email: "owner@test.com",
                name: "Owner Test",
                role: UserRole.OWNER,
                ownerId: "owner-456",
            });

        mockAuthRepository.createOwnerProfile.mockResolvedValue("owner-456");
        mockAuthRepository.createSession.mockResolvedValue({});

        const result = await useCase.execute({
            userId,
            role: UserRole.OWNER,
            phone: "+573001234567",
            address: "Calle 123 # 45-67",
        });

        expect(mockAuthRepository.createOwnerProfile).toHaveBeenCalledWith(userId, {
            phone: "+573001234567",
            address: "Calle 123 # 45-67",
        });
        expect(mockTokenService.generateTokens).toHaveBeenCalledWith(expect.objectContaining({
            sub: userId,
            role: UserRole.OWNER,
            ownerId: "owner-456",
        }));
        expect(result.statusCode).toBe(200);
        expect(result.data?.accessToken).toBe("new-access-token");
        expect(result.data?.user.role).toBe(UserRole.OWNER);
    });

    it("should complete registration for VETERINARIAN successfully", async () => {
        const userId = "vet-user-123";
        mockAuthRepository.findUserRoleInfo
            .mockResolvedValueOnce({
                id: userId,
                email: "vet@test.com",
                name: "Vet Test",
                role: UserRole.UNKNOWN,
            })
            .mockResolvedValueOnce({
                id: userId,
                email: "vet@test.com",
                name: "Vet Test",
                role: UserRole.VETERINARIAN,
                veterinarianId: "vet-789",
                clinicId: "clinic-001",
            });

        mockAuthRepository.createVeterinarianProfile.mockResolvedValue("vet-789");
        mockAuthRepository.createSession.mockResolvedValue({});

        const result = await useCase.execute({
            userId,
            role: UserRole.VETERINARIAN,
            phone: "+573109876543",
            clinicId: "clinic-001",
            specialty: "Cirugía",
        });

        expect(mockAuthRepository.createVeterinarianProfile).toHaveBeenCalledWith(userId, {
            clinicId: "clinic-001",
            phone: "+573109876543",
            specialty: "Cirugía",
        });
        expect(result.statusCode).toBe(200);
        expect(result.data?.user.role).toBe(UserRole.VETERINARIAN);
    });

    it("should throw UserNotExistException if user does not exist", async () => {
        mockAuthRepository.findUserRoleInfo.mockResolvedValue(null);

        await expect(useCase.execute({
            userId: "non-existent",
            role: UserRole.OWNER,
            phone: "+573001234567",
            address: "Calle 1",
        })).rejects.toThrow(UserNotExistException);
    });

    it("should throw BadRequestException if OWNER is missing address", async () => {
        mockAuthRepository.findUserRoleInfo.mockResolvedValue({
            id: "user-1",
            email: "test@test.com",
            role: UserRole.UNKNOWN,
        });

        await expect(useCase.execute({
            userId: "user-1",
            role: UserRole.OWNER,
            phone: "+573001234567",
        })).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException if VETERINARIAN is missing clinicId", async () => {
        mockAuthRepository.findUserRoleInfo.mockResolvedValue({
            id: "user-1",
            email: "test@test.com",
            role: UserRole.UNKNOWN,
        });

        await expect(useCase.execute({
            userId: "user-1",
            role: UserRole.VETERINARIAN,
            phone: "+573001234567",
        })).rejects.toThrow(BadRequestException);
    });
});
