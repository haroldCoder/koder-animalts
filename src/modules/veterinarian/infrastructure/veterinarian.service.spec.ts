import { Test, TestingModule } from '@nestjs/testing';
import { VeterinarianService } from '@veterinarian/infrastructure/veterinarian.service';
import { PrismaService } from '@/common/infrastructure/db/prisma.service';
import { CreateVeterinarianDto } from '@veterinarian/infrastructure/dto';
import { PhoneNotFoundException, UserIdNotFoundException } from '@/common/domain/exceptions';
import { ClinicIdNotFoundException } from '@veterinarian/domain/exceptions';

describe('VeterinarianService', () => {
    let service: VeterinarianService;
    let prisma: PrismaService;

    const mockPrismaService = {
        veterinarian: {
            create: jest.fn(),
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
});
