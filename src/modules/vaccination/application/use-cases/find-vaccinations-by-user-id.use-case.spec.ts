import { Test, TestingModule } from "@nestjs/testing";
import { FindVaccinationsByUserIdUseCase } from "./find-vaccinations-by-user-id.use-case";
import { HttpStatus } from "@nestjs/common";
import { UserIdNotFoundException } from "@/common/domain/exceptions";

describe("FindVaccinationsByUserIdUseCase", () => {
    let useCase: FindVaccinationsByUserIdUseCase;
    let mockVaccinationRepository: any;

    beforeEach(async () => {
        mockVaccinationRepository = {
            findByUserId: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FindVaccinationsByUserIdUseCase,
                {
                    provide: "IVaccinationRepository",
                    useValue: mockVaccinationRepository,
                },
            ],
        }).compile();

        useCase = module.get<FindVaccinationsByUserIdUseCase>(FindVaccinationsByUserIdUseCase);
    });

    it("should be defined", () => {
        expect(useCase).toBeDefined();
    });

    it("should return vaccinations for valid userId and criteria", async () => {
        const mockVaccinations = [
            {
                id: "vac-1",
                vaccineName: "Rabies",
                dateAdministered: new Date(),
                nextDueDate: new Date(),
                lotNumber: "12345",
                medicalRecordId: "mr-1",
                createdAt: new Date(),
            },
        ];

        mockVaccinationRepository.findByUserId.mockResolvedValue(mockVaccinations);

        const result = await useCase.execute("user-123", {
            page: 1,
            limit: 10,
            medicalRecordId: "mr-1",
        });

        expect(mockVaccinationRepository.findByUserId).toHaveBeenCalledWith("user-123", {
            page: 1,
            limit: 10,
            medicalRecordId: "mr-1",
        });

        expect(result).toEqual({
            statusCode: HttpStatus.OK,
            message: "Vaccinations retrieved successfully",
            data: mockVaccinations,
        });
    });

    it("should throw UserIdNotFoundException if repository throws it", async () => {
        mockVaccinationRepository.findByUserId.mockRejectedValue(new UserIdNotFoundException());

        await expect(
            useCase.execute("invalid-user", { page: 1, limit: 10 })
        ).rejects.toThrow(UserIdNotFoundException);
    });
});
