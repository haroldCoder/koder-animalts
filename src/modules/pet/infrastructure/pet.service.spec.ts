import { Test, TestingModule } from '@nestjs/testing';
import { PetService } from '@pet/infrastructure/pet.service';
import { PrismaService } from '@/common/infrastructure/db/prisma.service';
import { RegisterPetDto, UpdatePetDto } from '@pet/infrastructure/dto';
import { PetClinicIdNotFoundException, PetMainImageNotFoundException, PetNameNotFoundException, PetOwnerIdNotFoundException, PetSpeciesNotFoundException } from '@pet/domain/exceptions';
import { PetIdNotFoundException } from '@/common/domain/exceptions';
import { GenderPet } from '@pet/domain/enums';

describe('PetService', () => {
    let service: PetService;
    let prisma: PrismaService;

    const mockPrismaService = {
        pet: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PetService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<PetService>(PetService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('registerPet', () => {
        const registerPetDto: RegisterPetDto = {
            name: 'Fluffy',
            species: 'Dog',
            breed: 'Golden Retriever',
            birthDate: new Date(),
            gender: GenderPet.MALE,
            weight: 25,
            color: 'Golden',
            microchip: '123456789',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            mainImage: 'http://example.com/image.jpg',
            ownerId: 'owner-123',
            clinicId: 'clinic-123',
        };

        it('should register a pet successfully', async () => {
            mockPrismaService.pet.create.mockResolvedValue({ id: 'pet-123', ...registerPetDto });

            const result = await service.registerPet(registerPetDto);

            expect(prisma.pet.create).toHaveBeenCalledWith({ data: registerPetDto });
            expect(result).toEqual({
                statusCode: 201,
                message: 'Pet registered successfully',
            });
        });

        it('should throw PetMainImageNotFoundException if mainImage is missing', async () => {
            const dto = { ...registerPetDto, mainImage: '' } as RegisterPetDto;
            await expect(service.registerPet(dto)).rejects.toThrow(PetMainImageNotFoundException);
        });

        it('should throw PetNameNotFoundException if name is missing', async () => {
            const dto = { ...registerPetDto, name: '' } as RegisterPetDto;
            await expect(service.registerPet(dto)).rejects.toThrow(PetNameNotFoundException);
        });

        it('should throw PetSpeciesNotFoundException if species is missing', async () => {
            const dto = { ...registerPetDto, species: '' } as RegisterPetDto;
            await expect(service.registerPet(dto)).rejects.toThrow(PetSpeciesNotFoundException);
        });

        it('should throw PetOwnerIdNotFoundException if ownerId is missing', async () => {
            const dto = { ...registerPetDto, ownerId: '' } as RegisterPetDto;
            await expect(service.registerPet(dto)).rejects.toThrow(PetOwnerIdNotFoundException);
        });

        it('should throw PetClinicIdNotFoundException if clinicId is missing', async () => {
            const dto = { ...registerPetDto, clinicId: '' } as RegisterPetDto;
            await expect(service.registerPet(dto)).rejects.toThrow(PetClinicIdNotFoundException);
        });
    });

    describe('updatePet', () => {
        const petId = 'pet-123';
        const updatePetDto: UpdatePetDto = { name: 'Fluffy Updated' };

        it('should update a pet successfully', async () => {
            mockPrismaService.pet.update.mockResolvedValue({ id: petId, ...updatePetDto });

            const result = await service.updatePet(updatePetDto, petId);

            expect(prisma.pet.update).toHaveBeenCalledWith({
                where: { id: petId },
                data: updatePetDto,
            });
            expect(result).toEqual({
                statusCode: 200,
                message: 'Pet updated successfully',
            });
        });

        it('should throw PetIdNotFoundException if id is missing', async () => {
            await expect(service.updatePet(updatePetDto, '')).rejects.toThrow(PetIdNotFoundException);
        });
    });

    describe('deletePet', () => {
        const petId = 'pet-123';

        it('should delete a pet successfully', async () => {
            mockPrismaService.pet.delete.mockResolvedValue({ id: petId });

            const result = await service.deletePet(petId);

            expect(prisma.pet.delete).toHaveBeenCalledWith({ where: { id: petId } });
            expect(result).toEqual({
                statusCode: 200,
                message: 'Pet deleted successfully',
            });
        });

        it('should throw PetIdNotFoundException if id is missing', async () => {
            await expect(service.deletePet('')).rejects.toThrow(PetIdNotFoundException);
        });
    });

    describe('getPetById', () => {
        const petId = 'pet-123';
        const mockPet = {
            id: petId,
            name: 'Fluffy',
            species: 'Dog',
            gender: 'MALE',
            mainImage: 'image.jpg',
            ownerId: 'owner-123',
            clinicId: 'clinic-123',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should return a pet by id', async () => {
            mockPrismaService.pet.findUnique.mockResolvedValue(mockPet);

            const result = await service.getPetById(petId);

            expect(prisma.pet.findUnique).toHaveBeenCalledWith({ where: { id: petId } });
            expect(result).toEqual({
                statusCode: 200,
                data: { ...mockPet, gender: GenderPet.MALE },
            });
        });

        it('should throw PetIdNotFoundException if id is missing', async () => {
            await expect(service.getPetById('')).rejects.toThrow(PetIdNotFoundException);
        });

        it('should throw PetIdNotFoundException if pet is not found', async () => {
            mockPrismaService.pet.findUnique.mockResolvedValue(null);
            await expect(service.getPetById(petId)).rejects.toThrow(PetIdNotFoundException);
        });
    });
});
