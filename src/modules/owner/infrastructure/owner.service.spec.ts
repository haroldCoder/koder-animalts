import { Test, TestingModule } from '@nestjs/testing';
import { OwnerService } from './owner.service';
import { PrismaService } from '@/common/infrastructure/db/prisma.service';
import { CreateOwnerDto } from '@owner/infrastructure/dto';
import { AdressNotFoundException } from '@owner/domain/exceptions';
import { PhoneNotFoundException, UserIdNotFoundException } from '@/common/domain/exceptions';

describe('OwnerService', () => {
    let service: OwnerService;
    let prisma: PrismaService;

    const mockPrismaService = {
        owner: {
            create: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OwnerService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<OwnerService>(OwnerService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createOwner', () => {
        const createOwnerDto: CreateOwnerDto = {
            address: '123 Main St',
            phone: '1234567890',
            userId: 'user-123',
        };

        it('should create an owner successfully', async () => {
            const mockCreatedOwner = { id: 'owner-123', ...createOwnerDto };
            mockPrismaService.owner.create.mockResolvedValue(mockCreatedOwner);

            const result = await service.createOwner(createOwnerDto);

            expect(prisma.owner.create).toHaveBeenCalledWith({ data: createOwnerDto });
            expect(result).toEqual({
                message: 'Owner created successfully',
                statusCode: 201,
                data: 'owner-123',
            });
        });

        it('should throw AdressNotFoundException if address is missing', async () => {
            const dtoWithoutAddress = { ...createOwnerDto, address: '' } as CreateOwnerDto;
            await expect(service.createOwner(dtoWithoutAddress)).rejects.toThrow(AdressNotFoundException);
        });

        it('should throw PhoneNotFoundException if phone is missing', async () => {
            const dtoWithoutPhone = { ...createOwnerDto, phone: '' } as CreateOwnerDto;
            await expect(service.createOwner(dtoWithoutPhone)).rejects.toThrow(PhoneNotFoundException);
        });

        it('should throw UserIdNotFoundException if userId is missing', async () => {
            const dtoWithoutUserId = { ...createOwnerDto, userId: '' } as CreateOwnerDto;
            await expect(service.createOwner(dtoWithoutUserId)).rejects.toThrow(UserIdNotFoundException);
        });
    });
});
