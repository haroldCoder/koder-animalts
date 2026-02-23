import { Test, TestingModule } from '@nestjs/testing';
import { VeterinaryClinicsService } from './veterinary-clinics.service';
import { PrismaService } from '@/common/infrastructure/db/prisma.service';
import { RegisterVeterinaryClinicDto } from './dto';
import { NameClinicNotFoundException, EmailOrPhoneNotFoundException } from '@veterinary-clinics/domain/exceptions';
import { AdressNotFoundException } from '@/common/domain/exceptions';

describe('VeterinaryClinicsService', () => {
    let service: VeterinaryClinicsService;
    let prisma: PrismaService;

    const mockPrismaService = {
        veterinaryClinic: {
            create: jest.fn(),
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VeterinaryClinicsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<VeterinaryClinicsService>(VeterinaryClinicsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createVeterinaryClinic', () => {
        const dto: RegisterVeterinaryClinicDto = {
            name: 'Happy Paws',
            address: '123 Pet St',
            phone: '123456789',
            email: 'contact@happypaws.com',
        };

        it('should create a clinic successfully', async () => {
            const mockClinic = { id: 'clinic-1', ...dto };
            mockPrismaService.veterinaryClinic.create.mockResolvedValue(mockClinic);

            const result = await service.createVeterinaryClinic(dto);

            expect(prisma.veterinaryClinic.create).toHaveBeenCalledWith({ data: dto });
            expect(result).toEqual(mockClinic);
        });

        it('should throw NameClinicNotFoundException if name is missing', async () => {
            const invalidDto = { ...dto, name: '' };
            await expect(service.createVeterinaryClinic(invalidDto)).rejects.toThrow(NameClinicNotFoundException);
        });

        it('should throw AdressNotFoundException if address is missing', async () => {
            const invalidDto = { ...dto, address: '' };
            await expect(service.createVeterinaryClinic(invalidDto)).rejects.toThrow(AdressNotFoundException);
        });

        it('should throw EmailOrPhoneNotFoundException if both email and phone are missing', async () => {
            const invalidDto = { ...dto, email: '', phone: '' };
            await expect(service.createVeterinaryClinic(invalidDto)).rejects.toThrow(EmailOrPhoneNotFoundException);
        });
    });

    describe('findAllVeterinaryClinics', () => {
        it('should return all clinics', async () => {
            const mockClinics = [{ id: '1', name: 'Clinic 1' }, { id: '2', name: 'Clinic 2' }];
            mockPrismaService.veterinaryClinic.findMany.mockResolvedValue(mockClinics);

            const result = await service.findAllVeterinaryClinics();

            expect(prisma.veterinaryClinic.findMany).toHaveBeenCalled();
            expect(result).toEqual({
                statusCode: 200,
                data: mockClinics,
            });
        });
    });
});
