import { Test, TestingModule } from '@nestjs/testing';
import { VeterinarianService } from '@veterinarian/infrastructure/veterinarian.service';
import { PrismaService } from '@/common/infrastructure/db/prisma.service';
import { CreateVeterinarianDto } from '@veterinarian/infrastructure/dto';
import { PhoneNotFoundException, UserIdNotFoundException } from '@/common/domain/exceptions';
import { ClinicIdNotFoundException } from '@veterinarian/domain/exceptions';
import { VeterinarianIdNotExistException, VeterinarianIdNotFoundException } from '@/common/domain/exceptions';

describe('VeterinarianService', () => {
    let service: VeterinarianService;
    let prisma: PrismaService;

    const mockPrismaService = {
        veterinarian: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VeterinarianService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<VeterinarianService>(VeterinarianService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createVeterinarian', () => {
        const createVeterinarianDto: CreateVeterinarianDto = {
            specialty: 'Cardiology',
            phone: '1234567890',
            userId: 'user-123',
            clinicId: 'clinic-123',
        };

        it('should create a veterinarian successfully', async () => {
            const mockCreatedVeterinarian = { id: 'vet-123', ...createVeterinarianDto };
            mockPrismaService.veterinarian.create.mockResolvedValue(mockCreatedVeterinarian);

            const result = await service.createVeterinarian(createVeterinarianDto);

            expect(prisma.veterinarian.create).toHaveBeenCalledWith({ data: createVeterinarianDto });
            expect(result).toEqual({
                message: 'Veterinarian created successfully',
                statusCode: 201,
                data: 'vet-123',
            });
        });

        it('should throw PhoneNotFoundException if phone is missing', async () => {
            const dtoWithoutPhone = { ...createVeterinarianDto, phone: '' } as CreateVeterinarianDto;
            await expect(service.createVeterinarian(dtoWithoutPhone)).rejects.toThrow(PhoneNotFoundException);
        });

        it('should throw UserIdNotFoundException if userId is missing', async () => {
            const dtoWithoutUserId = { ...createVeterinarianDto, userId: '' } as CreateVeterinarianDto;
            await expect(service.createVeterinarian(dtoWithoutUserId)).rejects.toThrow(UserIdNotFoundException);
        });

        it('should throw ClinicIdNotFoundException if clinicId is missing', async () => {
            const dtoWithoutClinicId = { ...createVeterinarianDto, clinicId: '' } as CreateVeterinarianDto;
            await expect(service.createVeterinarian(dtoWithoutClinicId)).rejects.toThrow(ClinicIdNotFoundException);
        });
    });

    describe('findClinicOfVeterinarian', () => {
        const veterinarianId = 'vet-123';

        it('should return veterinarian details with user and clinic info', async () => {
            const mockVeterinarian = {
                id: veterinarianId,
                specialty: 'Cardiology',
                phone: '1234567890',
                user: { id: 'user-123', name: 'John Doe' },
                clinic: { id: 'clinic-123', name: 'Animal Clinic' },
            };
            mockPrismaService.veterinarian.findUnique.mockResolvedValue(mockVeterinarian);

            const result = await service.findClinicOfVeterinarian(veterinarianId);

            expect(prisma.veterinarian.findUnique).toHaveBeenCalledWith({
                where: { id: veterinarianId },
                include: {
                    user: { select: { id: true, name: true } },
                    clinic: { select: { id: true, name: true } },
                },
            });
            expect(result).toEqual({
                message: 'Veterinarian found successfully',
                statusCode: 200,
                data: {
                    user: mockVeterinarian.user,
                    clinic: mockVeterinarian.clinic,
                    specialty: mockVeterinarian.specialty,
                    phone: mockVeterinarian.phone,
                },
            });
        });

        it('should throw VeterinarianIdNotFoundException if id is missing', async () => {
            await expect(service.findClinicOfVeterinarian('')).rejects.toThrow(VeterinarianIdNotFoundException);
        });

        it('should throw VeterinarianIdNotExistException if veterinarian is not found', async () => {
            mockPrismaService.veterinarian.findUnique.mockResolvedValue(null);
            await expect(service.findClinicOfVeterinarian(veterinarianId)).rejects.toThrow(VeterinarianIdNotExistException);
        });
    });
});
