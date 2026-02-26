import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRecordService } from './medical-record.service';
import { PrismaService } from '@/common/infrastructure/db/prisma.service';
import { PetService } from '@pet/infrastructure';
import { VeterinarianService } from '@veterinarian/infrastructure';
import { DocumentService } from '@document/infrastructure';
import { RegisterMedicalRecordDto } from './dto';
import { MedicalRecordType } from '@medical-record/domain/enums';
import {
    PetIdNotFoundException,
} from '@/common/domain/exceptions';
import {
    MedicalRecordTypeNotFoundException,
    MedicalRecordReasonForVisitNotFoundException,
    MedicalRecordVisitDateNotFoundException,
    MedicalRecordNotFoundException
} from '@medical-record/domain/exceptions';
import * as sleepUtil from '@/common/infrastructure/utils/sleep.util';

jest.mock('@/common/infrastructure/utils/sleep.util', () => ({
    sleep: jest.fn().mockResolvedValue(undefined),
}));

describe('MedicalRecordService', () => {
    let service: MedicalRecordService;
    let prisma: PrismaService;
    let petService: PetService;
    let veterinarianService: VeterinarianService;
    let documentService: DocumentService;

    const mockPrismaService = {
        medicalRecord: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
    };

    const mockPetService = {
        getPetById: jest.fn(),
    };

    const mockVeterinarianService = {
        getVeterinarianById: jest.fn(),
        getVeterinaryClinicByVeterinarianId: jest.fn(),
    };

    const mockDocumentService = {
        registerDocument: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MedicalRecordService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: PetService, useValue: mockPetService },
                { provide: VeterinarianService, useValue: mockVeterinarianService },
                { provide: DocumentService, useValue: mockDocumentService },
            ],
        }).compile();

        service = module.get<MedicalRecordService>(MedicalRecordService);
        prisma = module.get<PrismaService>(PrismaService);
        petService = module.get<PetService>(PetService);
        veterinarianService = module.get<VeterinarianService>(VeterinarianService);
        documentService = module.get<DocumentService>(DocumentService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createMedicalRecord', () => {
        const medicalRecordDto: RegisterMedicalRecordDto = {
            petId: 'pet-123',
            veterinarianId: 'vet-123',
            type: MedicalRecordType.CONSULTATION,
            reasonForVisit: 'Annual checkup',
            visitDate: new Date(),
            notes: 'Good boy',
            diagnosis: 'Healthy',
            treatment: 'None',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should create a medical record successfully', async () => {
            mockPetService.getPetById.mockResolvedValue({});
            mockVeterinarianService.getVeterinarianById.mockResolvedValue({});
            mockPrismaService.medicalRecord.create.mockResolvedValue({ id: 'mr-123', ...medicalRecordDto });

            const result = await service.createMedicalRecord(medicalRecordDto);

            expect(petService.getPetById).toHaveBeenCalledWith(medicalRecordDto.petId);
            expect(veterinarianService.getVeterinarianById).toHaveBeenCalledWith(medicalRecordDto.veterinarianId);
            expect(prisma.medicalRecord.create).toHaveBeenCalled();
            expect(result).toEqual({
                statusCode: 201,
                message: 'Medical record created successfully',
            });
        });

        it('should throw PetIdNotFoundException if petId is missing', async () => {
            const dto = { ...medicalRecordDto, petId: '' };
            await expect(service.createMedicalRecord(dto)).rejects.toThrow(PetIdNotFoundException);
        });

        it('should throw MedicalRecordTypeNotFoundException if type is missing', async () => {
            const dto = { ...medicalRecordDto, type: undefined as any };
            await expect(service.createMedicalRecord(dto)).rejects.toThrow(MedicalRecordTypeNotFoundException);
        });
    });

    describe('getMedicalRecordById', () => {
        const mrId = 'mr-123';
        const mockMr = {
            id: mrId,
            petId: 'pet-123',
            veterinarianId: 'vet-123',
            type: 'CONSULTATION',
            reasonForVisit: 'Checkup',
            visitDate: new Date(),
            diagnosis: 'Healthy',
            treatment: 'None',
            notes: 'Good boy',
        };

        it('should return a medical record by id', async () => {
            mockPrismaService.medicalRecord.findUnique.mockResolvedValue(mockMr);

            const result = await service.getMedicalRecordById(mrId);

            expect(prisma.medicalRecord.findUnique).toHaveBeenCalledWith({ where: { id: mrId } });
            expect(result.statusCode).toBe(200);
            expect(result.data?.id).toBe(mrId);
        });

        it('should throw MedicalRecordVisitDateNotFoundException if id is missing', async () => {
            await expect(service.getMedicalRecordById('')).rejects.toThrow(MedicalRecordVisitDateNotFoundException);
        });

        it('should throw MedicalRecordNotFoundException if record not found', async () => {
            mockPrismaService.medicalRecord.findUnique.mockResolvedValue(null);
            await expect(service.getMedicalRecordById(mrId)).rejects.toThrow(MedicalRecordNotFoundException);
        });
    });

    describe('uploadDocumentOfMedicalRecord', () => {
        const mrId = 'mr-123';
        const documents = [
            { title: 'Doc 1', fileUrl: 'url1', fileKey: 'key1', fileSize: 100 },
            { title: 'Doc 2', fileUrl: 'url2', fileKey: 'key2', fileSize: 200 },
        ];
        const mockMr = {
            statusCode: 200,
            data: {
                id: mrId,
                petId: 'pet-123',
                veterinarianId: 'vet-123',
            }
        };

        it('should upload documents successfully with delay', async () => {
            mockPrismaService.medicalRecord.findUnique.mockResolvedValue(mockMr.data);
            mockVeterinarianService.getVeterinaryClinicByVeterinarianId.mockResolvedValue({ id: 'clinic-123' });
            mockDocumentService.registerDocument.mockResolvedValue({ statusCode: 201 });

            const result = await service.uploadDocumentOfMedicalRecord(mrId, documents);

            expect(mockDocumentService.registerDocument).toHaveBeenCalledTimes(2);
            expect(sleepUtil.sleep).toHaveBeenCalledTimes(2);
            expect(sleepUtil.sleep).toHaveBeenCalledWith(500);
            expect(result.statusCode).toBe(201);
            expect(result.message).toContain('2 documents uploaded successfully');
        });

        it('should throw MedicalRecordNotFoundException if record does not exist', async () => {
            mockPrismaService.medicalRecord.findUnique.mockResolvedValue(null);
            await expect(service.uploadDocumentOfMedicalRecord(mrId, documents)).rejects.toThrow(MedicalRecordNotFoundException);
        });
    });
});
