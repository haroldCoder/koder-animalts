import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from '@document/presentation/document.controller';
import {
    DeleteDocumentUseCase,
    GetDocumentByIdUseCase,
    RegisterDocumentUseCase,
    UpdateDocumentUseCase
} from '@document/application/use-cases';
import { RegisterDocumentRequestDto, UpdateDocumentDto } from '@document/presentation/dtos';
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

    const mockRegisterUseCase = { execute: jest.fn() };
    const mockUpdateUseCase = { execute: jest.fn() };
    const mockDeleteUseCase = { execute: jest.fn() };
    const mockGetByIdUseCase = { execute: jest.fn() };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DocumentController],
            providers: [
                { provide: RegisterDocumentUseCase, useValue: mockRegisterUseCase },
                { provide: UpdateDocumentUseCase, useValue: mockUpdateUseCase },
                { provide: DeleteDocumentUseCase, useValue: mockDeleteUseCase },
                { provide: GetDocumentByIdUseCase, useValue: mockGetByIdUseCase },
            ],
        }).compile();

        controller = module.get<DocumentController>(DocumentController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('registerDocument', () => {
        it('should call upload and registerUseCase.execute', async () => {
            const dto: RegisterDocumentRequestDto = {
                title: 'Test Doc',
                category: 'HEALTH',
                clinicId: 'clinic-123',
            };
            const mockFile = { buffer: Buffer.from('test') } as Express.Multer.File;

            mockRegisterUseCase.execute.mockResolvedValue({
                statusCode: 201,
                message: 'Document registered successfully',
            });

            const result = await controller.registerDocument(dto, mockFile);

            expect(UploadFileCommand).toHaveBeenCalled();
            expect(mockRegisterUseCase.execute).toHaveBeenCalledWith(expect.objectContaining({
                ...dto,
                fileUrl: 'http://example.com/file.pdf',
                fileKey: 'file-key',
                fileSize: 1024,
                fileType: 'application/pdf',
                userId: expect.any(String),
            }));
            expect(result).toEqual({
                statusCode: 201,
                message: 'Document registered successfully',
            });
        });
    });

    describe('updateDocument', () => {
        it('should call updateUseCase.execute', async () => {
            const id = 'doc-123';
            const dto: UpdateDocumentDto = { title: 'Updated' };
            mockUpdateUseCase.execute.mockResolvedValue({
                statusCode: 200,
                message: 'Updated',
            });

            const result = await controller.updateDocument(id, dto);

            expect(mockUpdateUseCase.execute).toHaveBeenCalledWith(dto, id);
            expect(result).toEqual({
                statusCode: 200,
                message: 'Updated',
            });
        });
    });

    describe('deleteDocument', () => {
        it('should call deleteUseCase.execute', async () => {
            const id = 'doc-123';
            mockDeleteUseCase.execute.mockResolvedValue({
                statusCode: 200,
                message: 'Deleted',
            });

            const result = await controller.deleteDocument(id);

            expect(mockDeleteUseCase.execute).toHaveBeenCalledWith(id);
            expect(result).toEqual({
                statusCode: 200,
                message: 'Deleted',
            });
        });
    });

    describe('getDocumentById', () => {
        it('should call getByIdUseCase.execute', async () => {
            const id = 'doc-123';
            const mockDoc = { id, title: 'Test' };
            mockGetByIdUseCase.execute.mockResolvedValue({
                statusCode: 200,
                data: mockDoc,
            });

            const result = await controller.getDocumentById(id);

            expect(mockGetByIdUseCase.execute).toHaveBeenCalledWith(id);
            expect(result).toEqual({
                statusCode: 200,
                data: mockDoc,
            });
        });
    });
});

