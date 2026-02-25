import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from '@document/infrastructure/document.controller';
import { DocumentService } from '@document/infrastructure/document.service';
import { RegisterDocumentRequestDto, UpdateDocumentDto } from '@document/infrastructure/dto';
import { UploadFileCommand } from '@/common/upload/application/use-cases';
import { UploadPlatformEnum } from '@/common/upload/domain/enums';

// Mock the UploadFileCommand class
jest.mock('@/common/upload/application/use-cases', () => ({
    UploadFileCommand: jest.fn().mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue({
            fileUrl: 'http://example.com/file.pdf',
            fileKey: 'file-key',
            fileSize: 1024,
            fileType: 'application/pdf',
        }),
    })),
}));

describe('DocumentController', () => {
    let controller: DocumentController;
    let service: DocumentService;

    const mockDocumentService = {
        registerDocument: jest.fn(),
        updateDocument: jest.fn(),
        deleteDocument: jest.fn(),
        getDocumentById: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DocumentController],
            providers: [
                {
                    provide: DocumentService,
                    useValue: mockDocumentService,
                },
            ],
        }).compile();

        controller = module.get<DocumentController>(DocumentController);
        service = module.get<DocumentService>(DocumentService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('registerDocument', () => {
        it('should call upload and service.registerDocument', async () => {
            const dto: RegisterDocumentRequestDto = {
                title: 'Test Doc',
                category: 'HEALTH',
                clinicId: 'clinic-123',
            };
            const mockFile = { buffer: Buffer.from('test') } as Express.Multer.File;

            mockDocumentService.registerDocument.mockResolvedValue({
                statusCode: 201,
                message: 'Document registered successfully',
            });

            const result = await controller.registerDocument(dto, mockFile);

            expect(UploadFileCommand).toHaveBeenCalledWith(mockFile, UploadPlatformEnum.CLOUDINARY);
            expect(service.registerDocument).toHaveBeenCalledWith({
                ...dto,
                fileUrl: 'http://example.com/file.pdf',
                fileKey: 'file-key',
                fileSize: 1024,
                fileType: 'application/pdf',
            });
            expect(result).toEqual({
                statusCode: 201,
                message: 'Document registered successfully',
            });
        });
    });

    describe('updateDocument', () => {
        it('should call service.updateDocument', async () => {
            const id = 'doc-123';
            const dto: UpdateDocumentDto = { title: 'Updated' };
            mockDocumentService.updateDocument.mockResolvedValue({
                statusCode: 200,
                message: 'Updated',
            });

            const result = await controller.updateDocument(id, dto);

            expect(service.updateDocument).toHaveBeenCalledWith(dto, id);
            expect(result).toEqual({
                statusCode: 200,
                message: 'Updated',
            });
        });
    });

    describe('deleteDocument', () => {
        it('should call service.deleteDocument', async () => {
            const id = 'doc-123';
            mockDocumentService.deleteDocument.mockResolvedValue({
                statusCode: 200,
                message: 'Deleted',
            });

            const result = await controller.deleteDocument(id);

            expect(service.deleteDocument).toHaveBeenCalledWith(id);
            expect(result).toEqual({
                statusCode: 200,
                message: 'Deleted',
            });
        });
    });

    describe('getDocumentById', () => {
        it('should call service.getDocumentById', async () => {
            const id = 'doc-123';
            const mockDoc = { id, title: 'Test' };
            mockDocumentService.getDocumentById.mockResolvedValue({
                statusCode: 200,
                data: mockDoc,
            });

            const result = await controller.getDocumentById(id);

            expect(service.getDocumentById).toHaveBeenCalledWith(id);
            expect(result).toEqual({
                statusCode: 200,
                data: mockDoc,
            });
        });
    });
});
