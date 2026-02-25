import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from '@document/infrastructure/document.service';
import { PrismaService } from '@/common/infrastructure/db/prisma.service';
import { RegisterDocumentDto, UpdateDocumentDto } from '@document/infrastructure/dto';
import { DocumentFileUrlNotFoundException, DocumentIdNotFoundException, DocumentTitleNotFoundException } from '@document/domain/exceptions';

describe('DocumentService', () => {
    let service: DocumentService;
    let prisma: PrismaService;

    const mockPrismaService = {
        document: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DocumentService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<DocumentService>(DocumentService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('registerDocument', () => {
        const registerDocumentDto: RegisterDocumentDto = {
            title: 'Test Document',
            fileUrl: 'http://example.com/file.pdf',
            category: 'MEDICAL_REPORT',
            clinicId: 'clinic-123',
        };

        it('should register a document successfully', async () => {
            mockPrismaService.document.create.mockResolvedValue({ id: 'doc-123', ...registerDocumentDto });

            const result = await service.registerDocument(registerDocumentDto);

            expect(prisma.document.create).toHaveBeenCalled();
            expect(result).toEqual({
                statusCode: 201,
                message: 'Document registered successfully',
            });
        });

        it('should throw DocumentTitleNotFoundException if title is missing', async () => {
            const dto = { ...registerDocumentDto, title: '' } as RegisterDocumentDto;
            await expect(service.registerDocument(dto)).rejects.toThrow(DocumentTitleNotFoundException);
        });

        it('should throw DocumentFileUrlNotFoundException if fileUrl is missing', async () => {
            const dto = { ...registerDocumentDto, fileUrl: '' } as RegisterDocumentDto;
            await expect(service.registerDocument(dto)).rejects.toThrow(DocumentFileUrlNotFoundException);
        });
    });

    describe('updateDocument', () => {
        const docId = 'doc-123';
        const updateDocumentDto: UpdateDocumentDto = { title: 'Updated Title' };

        it('should update a document successfully', async () => {
            mockPrismaService.document.update.mockResolvedValue({ id: docId, ...updateDocumentDto });

            const result = await service.updateDocument(updateDocumentDto, docId);

            expect(prisma.document.update).toHaveBeenCalledWith({
                where: { id: docId },
                data: updateDocumentDto,
            });
            expect(result).toEqual({
                statusCode: 200,
                message: 'Document updated successfully',
            });
        });

        it('should throw DocumentIdNotFoundException if id is missing', async () => {
            await expect(service.updateDocument(updateDocumentDto, '')).rejects.toThrow(DocumentIdNotFoundException);
        });
    });

    describe('deleteDocument', () => {
        const docId = 'doc-123';

        it('should delete a document successfully', async () => {
            mockPrismaService.document.delete.mockResolvedValue({ id: docId });

            const result = await service.deleteDocument(docId);

            expect(prisma.document.delete).toHaveBeenCalledWith({ where: { id: docId } });
            expect(result).toEqual({
                statusCode: 200,
                message: 'Document deleted successfully',
            });
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
            expect(result).toEqual({
                statusCode: 200,
                data: mockDoc,
            });
        });

        it('should throw DocumentIdNotFoundException if id is missing', async () => {
            await expect(service.getDocumentById('')).rejects.toThrow(DocumentIdNotFoundException);
        });

        it('should throw DocumentIdNotFoundException if document is not found', async () => {
            mockPrismaService.document.findUnique.mockResolvedValue(null);
            await expect(service.getDocumentById(docId)).rejects.toThrow(DocumentIdNotFoundException);
        });
    });
});
