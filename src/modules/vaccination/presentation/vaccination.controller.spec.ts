import { Test, TestingModule } from '@nestjs/testing';
import { VaccinationController } from '@vaccination/presentation/vaccination.controller';
import {
    RegisterVaccinationUseCase,
    GetUpcomingVaccinationsByPetUseCase,
    GetNextVaccinationReminderUseCase,
    FindVaccinationsByUserIdUseCase,
    GetVaccinationByIdUseCase,
    UpdateStatusVaccinationUseCase,
} from '@vaccination/application/use-cases';
import { HttpStatus } from '@nestjs/common';

describe('VaccinationController', () => {
    let controller: VaccinationController;

    const mockRegisterUseCase = { execute: jest.fn() };
    const mockGetUpcomingUseCase = { execute: jest.fn() };
    const mockGetVaccinationByIdUseCase = { execute: jest.fn() };
    const mockGetNextReminderUseCase = { execute: jest.fn() };
    const mockFindVaccinationsByUserIdUseCase = { execute: jest.fn() };
    const mockUpdateStatusVaccinationUseCase = { execute: jest.fn() };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VaccinationController],
            providers: [
                { provide: RegisterVaccinationUseCase, useValue: mockRegisterUseCase },
                { provide: GetUpcomingVaccinationsByPetUseCase, useValue: mockGetUpcomingUseCase },
                { provide: GetVaccinationByIdUseCase, useValue: mockGetVaccinationByIdUseCase },
                { provide: GetNextVaccinationReminderUseCase, useValue: mockGetNextReminderUseCase },
                { provide: FindVaccinationsByUserIdUseCase, useValue: mockFindVaccinationsByUserIdUseCase },
                { provide: UpdateStatusVaccinationUseCase, useValue: mockUpdateStatusVaccinationUseCase },
            ],
        }).compile();

        controller = module.get<VaccinationController>(VaccinationController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findVaccinationsByUserId', () => {
        it('should call findVaccinationsByUserIdUseCase.execute with parsed pagination parameters', async () => {
            const userId = 'user-123';
            const page = '2';
            const limit = '5';
            const medicalRecordId = 'mr-999';

            const mockResult = {
                statusCode: HttpStatus.OK,
                message: 'Vaccinations retrieved successfully',
                data: [],
            };
            mockFindVaccinationsByUserIdUseCase.execute.mockResolvedValue(mockResult);

            const result = await controller.findVaccinationsByUserId(userId, page, limit, medicalRecordId);

            expect(mockFindVaccinationsByUserIdUseCase.execute).toHaveBeenCalledWith(userId, {
                page: 2,
                limit: 5,
                medicalRecordId: 'mr-999',
            });
            expect(result).toEqual(mockResult);
        });

        it('should pass undefined for page and limit if not provided', async () => {
            const userId = 'user-123';
            const mockResult = {
                statusCode: HttpStatus.OK,
                message: 'Vaccinations retrieved successfully',
                data: [],
            };
            mockFindVaccinationsByUserIdUseCase.execute.mockResolvedValue(mockResult);

            const result = await controller.findVaccinationsByUserId(userId, undefined, undefined, undefined);

            expect(mockFindVaccinationsByUserIdUseCase.execute).toHaveBeenCalledWith(userId, {
                page: undefined,
                limit: undefined,
                medicalRecordId: undefined,
            });
            expect(result).toEqual(mockResult);
        });
    });
});
