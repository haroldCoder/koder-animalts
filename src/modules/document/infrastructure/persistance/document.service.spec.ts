import { Test, TestingModule } from '@nestjs/testing';
import { PrismaDocumentService } from '@document/infrastructure/persistance/prisma-document.service';
import { PrismaService } from '@/common/infrastructure/db/prisma.service';
import { FindDocumentsCriteria, UpdateDocumentFields } from '@document/domain/ports/document.repository';
import { DocumentEntity } from '@document/domain/entities';
import { RegisterDocumentModel } from '@/common/domain/models';
import { DocumentFileUrlNotFoundException, DocumentIdNotFoundException, DocumentTitleNotFoundException } from '@document/domain/exceptions';

describe('PrismaDocumentService', () => {
    let service: PrismaDocumentService;
    let prisma: PrismaService;

    const mockPrismaService = {
        document: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PrismaDocumentService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<PrismaDocumentService>(PrismaDocumentService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('registerDocument', () => {
        const registerDocumentModel: RegisterDocumentModel = {
            title: 'Test Document',
            fileUrl: 'http://example.com/file.pdf',
            category: 'MEDICAL_REPORT',
            clinicId: 'clinic-123',
        };

        it('should register a document successfully', async () => {
            mockPrismaService.document.create.mockResolvedValue({ id: 'doc-123', ...registerDocumentModel });

            const result = await service.registerDocument(registerDocumentModel);

            expect(prisma.document.create).toHaveBeenCalled();
            expect(result).toEqual('doc-123');
        });

        it('should throw DocumentTitleNotFoundException if title is missing', async () => {
            const model = { ...registerDocumentModel, title: '' } as RegisterDocumentModel;
            await expect(service.registerDocument(model)).rejects.toThrow(DocumentTitleNotFoundException);
        });

        it('should throw DocumentFileUrlNotFoundException if fileUrl is missing', async () => {
            const model = { ...registerDocumentModel, fileUrl: '' } as RegisterDocumentModel;
            await expect(service.registerDocument(model)).rejects.toThrow(DocumentFileUrlNotFoundException);
        });
    });

    describe('updateDocument', () => {
        const docId = 'doc-123';
        const updateDocumentFields: UpdateDocumentFields = { title: 'Updated Title' };

        it('should update a document successfully', async () => {
            mockPrismaService.document.update.mockResolvedValue({ id: docId, ...updateDocumentFields });

            const result = await service.updateDocument(updateDocumentFields, docId);

            expect(prisma.document.update).toHaveBeenCalledWith({
                where: { id: docId },
                data: updateDocumentFields,
            });
            expect(result).toEqual(docId);
        });

        it('should throw DocumentIdNotFoundException if id is missing', async () => {
            await expect(service.updateDocument(updateDocumentFields, '')).rejects.toThrow(DocumentIdNotFoundException);
        });
    });

    describe('deleteDocument', () => {
        const docId = 'doc-123';

        it('should delete a document successfully', async () => {
            mockPrismaService.document.delete.mockResolvedValue({ id: docId });

            const result = await service.deleteDocument(docId);

            expect(prisma.document.delete).toHaveBeenCalledWith({ where: { id: docId } });
            expect(result).toEqual(docId);
        });

        it('should throw DocumentIdNotFoundException if id is missing', async () => {
            await expect(service.deleteDocument('')).rejects.toThrow(DocumentIdNotFoundException);
        });
    });

    describe('getDocumentById', () => {
        const docId = 'doc-123';
        const mockDoc = {
            id: docId,
            title: 'Test Document',
            fileUrl: 'http://example.com/file.pdf',
        };

        it('should return a document by id', async () => {
            mockPrismaService.document.findUnique.mockResolvedValue(mockDoc);

            const result = await service.getDocumentById(docId);

            expect(prisma.document.findUnique).toHaveBeenCalledWith({ where: { id: docId } });
            expect(result.getId()).toEqual(docId);
            expect(result.getTitle()).toEqual(mockDoc.title);
        });

        it('should throw DocumentIdNotFoundException if id is missing', async () => {
            await expect(service.getDocumentById('')).rejects.toThrow(DocumentIdNotFoundException);
        });

        it('should throw DocumentIdNotFoundException if document is not found', async () => {
            mockPrismaService.document.findUnique.mockResolvedValue(null);
            await expect(service.getDocumentById(docId)).rejects.toThrow(DocumentIdNotFoundException);
        });
    });

    describe('findDocumentsByUserId', () => {
        const userId = 'user-123';
        const criteria: FindDocumentsCriteria = {
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-12-31'),
            veterinarianName: 'John',
            documentName: 'Report',
        };

        it('should find documents by user id and criteria', async () => {
            const mockDocs = [
                { id: 'doc-1', title: 'Report 1', fileUrl: 'http://example.com/1.pdf' },
            ];
            mockPrismaService.document.findMany.mockResolvedValue(mockDocs);

            const result = await service.findDocumentsByUserId(userId, criteria);

            expect(prisma.document.findMany).toHaveBeenCalledWith({
                where: {
                    createdAt: {
                        gte: criteria.startDate,
                        lte: criteria.endDate,
                    },
                    title: {
                        contains: criteria.documentName,
                        mode: 'insensitive',
                    },
                    medicalRecord: {
                        veterinarian: {
                            user: {
                                name: {
                                    contains: criteria.veterinarianName,
                                    mode: 'insensitive',
                                },
                            },
                        },
                        OR: [
                            {
                                pet: {
                                    owner: {
                                        userId: userId,
                                    },
                                },
                            },
                            {
                                veterinarian: {
                                    userId: userId,
                                }
                            },
                        ],
                    },
                },
                include: {
                    medicalRecord: {
                        select: {
                            pet: {
                                select: {
                                    name: true,
                                },
                            },
                            veterinarian: {
                                select: {
                                    user: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            expect(result.length).toBe(1);
            expect(result[0].getId()).toEqual(mockDocs[0].id);
        });
    });
});
