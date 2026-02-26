import { Test, TestingModule } from '@nestjs/testing';
import { VaccinationService } from './vaccination.service';
import { PrismaService } from '@/common/infrastructure/db/prisma.service';
import { RegisterVaccinationDto } from './dto';
import { ServerErrorException } from '@/common/domain/exceptions';

describe('VaccinationService', () => {
    let service: VaccinationService;
    let prisma: PrismaService;

    const mockPrismaService = {
        vaccination: {
            create: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VaccinationService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<VaccinationService>(VaccinationService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('registerVaccination', () => {
        const dto: RegisterVaccinationDto = {
            vaccineName: 'Rabies',
            medicalRecordId: 'mr-123',
            dateAdministered: new Date(),
            nextDueDate: new Date(),
            lotNumber: 'LOT-001',
        };

        it('should register a vaccination successfully', async () => {
            mockPrismaService.vaccination.create.mockResolvedValue({ id: 'v-123', ...dto });

            const result = await service.registerVaccination(dto);

            expect(prisma.vaccination.create).toHaveBeenCalled();
            expect(result).toEqual({
                statusCode: 201,
                message: 'Vaccination registered successfully',
            });
        });

        it('should throw ServerErrorException if creation fails', async () => {
            mockPrismaService.vaccination.create.mockRejectedValue(new Error());
            await expect(service.registerVaccination(dto)).rejects.toThrow(ServerErrorException);
        });
    });


    describe('getNextVaccinationReminder', () => {
        const petId = 'pet-123';
        const mockNextVaccination = { id: 'v-2', vaccineName: 'Distemper', nextDueDate: new Date() };

        it('should return the next vaccination reminder', async () => {
            mockPrismaService.vaccination.findFirst.mockResolvedValue(mockNextVaccination);

            const result = await service.getNextVaccinationReminder(petId);

            expect(prisma.vaccination.findFirst).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    medicalRecord: { petId },
                    nextDueDate: { gt: expect.any(Date) }
                },
                orderBy: { nextDueDate: 'asc' }
            }));
            expect(result.data).toEqual(mockNextVaccination);
        });

        it('should return null if no reminder found', async () => {
            mockPrismaService.vaccination.findFirst.mockResolvedValue(null);
            const result = await service.getNextVaccinationReminder(petId);
            expect(result.data).toBeNull();
        });
    });
});
