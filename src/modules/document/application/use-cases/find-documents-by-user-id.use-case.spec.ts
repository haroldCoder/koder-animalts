import { Test, TestingModule } from "@nestjs/testing";
import { FindDocumentsByUserIdUseCase } from "./find-documents-by-user-id.use-case";
import { HttpStatus } from "@nestjs/common";

describe("FindDocumentsByUserIdUseCase", () => {
    let useCase: FindDocumentsByUserIdUseCase;
    let mockDocumentRepository: any;

    beforeEach(async () => {
        mockDocumentRepository = {
            findDocumentsByUserId: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FindDocumentsByUserIdUseCase,
                {
                    provide: "IDocumentRepository",
                    useValue: mockDocumentRepository,
                },
            ],
        }).compile();

        useCase = module.get<FindDocumentsByUserIdUseCase>(FindDocumentsByUserIdUseCase);
    });

    it("should be defined", () => {
        expect(useCase).toBeDefined();
    });

    it("should return empty array if userId is missing", async () => {
        const result = await useCase.execute("", {
            startDate: new Date("2026-01-01"),
            endDate: new Date("2026-12-31"),
            veterinarianName: "John Doe",
            documentName: "Report",
        });

        expect(mockDocumentRepository.findDocumentsByUserId).not.toHaveBeenCalled();
        expect(result).toEqual({
            statusCode: HttpStatus.OK,
            message: "Documents retrieved successfully",
            data: [],
        });
    });

    it("should return empty array if all queries are missing", async () => {
        const result = await useCase.execute("user-123", {});

        expect(mockDocumentRepository.findDocumentsByUserId).not.toHaveBeenCalled();
        expect(result).toEqual({
            statusCode: HttpStatus.OK,
            message: "Documents retrieved successfully",
            data: [],
        });
    });

    it("should call repository if only documentName is passed", async () => {
        const mockDocs = [{ id: "doc-1", title: "Report 1", fileUrl: "http://example.com/1.pdf" }];
        mockDocumentRepository.findDocumentsByUserId.mockResolvedValue(mockDocs);

        const result = await useCase.execute("user-123", {
            documentName: "Report",
        });

        expect(mockDocumentRepository.findDocumentsByUserId).toHaveBeenCalledWith("user-123", {
            startDate: undefined,
            endDate: undefined,
            veterinarianName: undefined,
            documentName: "Report",
        });
        expect(result).toEqual({
            statusCode: HttpStatus.OK,
            message: "Documents retrieved successfully",
            data: mockDocs,
        });
    });

    it("should call repository if only veterinarianName is passed", async () => {
        const mockDocs = [{ id: "doc-2", title: "Doc 2", fileUrl: "http://example.com/2.pdf" }];
        mockDocumentRepository.findDocumentsByUserId.mockResolvedValue(mockDocs);

        const result = await useCase.execute("user-123", {
            veterinarianName: "Dr. House",
        });

        expect(mockDocumentRepository.findDocumentsByUserId).toHaveBeenCalledWith("user-123", {
            startDate: undefined,
            endDate: undefined,
            veterinarianName: "Dr. House",
            documentName: undefined,
        });
        expect(result).toEqual({
            statusCode: HttpStatus.OK,
            message: "Documents retrieved successfully",
            data: mockDocs,
        });
    });

    it("should return empty array if only invalid date is passed", async () => {
        const result = await useCase.execute("user-123", {
            startDate: new Date("not-a-date"),
        });

        expect(mockDocumentRepository.findDocumentsByUserId).not.toHaveBeenCalled();
        expect(result).toEqual({
            statusCode: HttpStatus.OK,
            message: "Documents retrieved successfully",
            data: [],
        });
    });

    it("should call repository if all queries are passed", async () => {
        const mockDocs = [
            { id: "doc-1", title: "Report 1", fileUrl: "http://example.com/1.pdf" }
        ];
        mockDocumentRepository.findDocumentsByUserId.mockResolvedValue(mockDocs);

        const queries = {
            startDate: new Date("2026-01-01"),
            endDate: new Date("2026-12-31"),
            veterinarianName: "John Doe",
            documentName: "Report",
        };

        const result = await useCase.execute("user-123", queries);

        expect(mockDocumentRepository.findDocumentsByUserId).toHaveBeenCalledWith("user-123", {
            startDate: new Date("2026-01-01"),
            endDate: new Date("2026-12-31"),
            veterinarianName: "John Doe",
            documentName: "Report",
        });
        expect(result).toEqual({
            statusCode: HttpStatus.OK,
            message: "Documents retrieved successfully",
            data: mockDocs,
        });
    });
});
