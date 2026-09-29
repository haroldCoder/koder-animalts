import { Test, TestingModule } from "@nestjs/testing";
import { CancelAppointmentRequestUseCase } from "./cancel-appointment-request.use-case";
import { IAppointmentRequestRepository } from "../../domain/ports";
import { IOwnerRepository } from "@owner/domain/ports";
import { AppointmentRequestEntity } from "../../domain/entities";
import { OwnerEntity } from "@owner/domain/entities";
import {
    AppointmentRequestNotFoundException,
    CannotCancelAppointmentRequestException,
} from "../../domain/exceptions";
import { OwnerNotFoundException } from "@owner/domain/exceptions";
import { UserIdNotFoundException } from "@/common/domain/exceptions";

describe("CancelAppointmentRequestUseCase", () => {
    let useCase: CancelAppointmentRequestUseCase;
    let requestRepo: jest.Mocked<IAppointmentRequestRepository>;
    let ownerRepo: jest.Mocked<IOwnerRepository>;

    const mockRequestRepo = {
        create: jest.fn(),
        findById: jest.fn(),
        findByClinic: jest.fn(),
        findByOwner: jest.fn(),
        findByUserId: jest.fn(),
        updateStatus: jest.fn(),
    };

    const mockOwnerRepo = {
        create: jest.fn(),
        findByUserId: jest.fn(),
        findById: jest.fn(),
    };

    const mockOwner = OwnerEntity.create({
        id: "owner-123",
        address: "Av. Siempre Viva 123",
        phone: "+5491112345678",
        userId: "user-123",
    });

    const createMockRequest = (overrides?: Partial<AppointmentRequestEntity>): AppointmentRequestEntity => {
        return new AppointmentRequestEntity(
            overrides?.id ?? "req-123",
            overrides?.ownerId ?? "owner-123",
            overrides?.petId ?? "pet-123",
            overrides?.clinicId ?? "clinic-123",
            overrides?.reason ?? "Vacuna antirrábica",
            overrides?.requestedDate ?? new Date("2026-10-15T10:00:00Z"),
            overrides?.status ?? "PENDING",
            overrides?.veterinarianId,
            overrides?.reviewedById,
            overrides?.rejectionReason,
        );
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CancelAppointmentRequestUseCase,
                {
                    provide: "IAppointmentRequestRepository",
                    useValue: mockRequestRepo,
                },
                {
                    provide: "IOwnerRepository",
                    useValue: mockOwnerRepo,
                },
            ],
        }).compile();

        useCase = module.get<CancelAppointmentRequestUseCase>(CancelAppointmentRequestUseCase);
        requestRepo = module.get("IAppointmentRequestRepository");
        ownerRepo = module.get("IOwnerRepository");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(useCase).toBeDefined();
    });

    it("should cancel an appointment request successfully when caller is the owner and request is pending", async () => {
        const existingRequest = createMockRequest({ status: "PENDING", ownerId: "owner-123" });
        const cancelledRequest = createMockRequest({ status: "CANCELLED", ownerId: "owner-123" });

        mockRequestRepo.findById.mockResolvedValueOnce(existingRequest);
        mockOwnerRepo.findByUserId.mockResolvedValueOnce(mockOwner);
        mockRequestRepo.updateStatus.mockResolvedValueOnce(cancelledRequest);

        const result = await useCase.execute("req-123", "user-123");

        expect(mockRequestRepo.findById).toHaveBeenCalledWith("req-123");
        expect(mockOwnerRepo.findByUserId).toHaveBeenCalledWith("user-123");
        expect(mockRequestRepo.updateStatus).toHaveBeenCalledWith("req-123", "CANCELLED");
        expect(result.status).toBe("CANCELLED");
    });

    it("should cancel successfully if owner is found via findById fallback", async () => {
        const existingRequest = createMockRequest({ status: "PENDING", ownerId: "owner-123" });
        const cancelledRequest = createMockRequest({ status: "CANCELLED", ownerId: "owner-123" });

        mockRequestRepo.findById.mockResolvedValueOnce(existingRequest);
        mockOwnerRepo.findByUserId.mockResolvedValueOnce(null);
        mockOwnerRepo.findById.mockResolvedValueOnce(mockOwner);
        mockRequestRepo.updateStatus.mockResolvedValueOnce(cancelledRequest);

        const result = await useCase.execute("req-123", "owner-123");

        expect(mockOwnerRepo.findByUserId).toHaveBeenCalledWith("owner-123");
        expect(mockOwnerRepo.findById).toHaveBeenCalledWith("owner-123");
        expect(mockRequestRepo.updateStatus).toHaveBeenCalledWith("req-123", "CANCELLED");
        expect(result).toEqual(cancelledRequest);
    });

    it("should throw UserIdNotFoundException when userId is empty", async () => {
        await expect(useCase.execute("req-123", "")).rejects.toThrow(UserIdNotFoundException);
        expect(mockRequestRepo.findById).not.toHaveBeenCalled();
    });

    it("should throw AppointmentRequestNotFoundException when request does not exist", async () => {
        mockRequestRepo.findById.mockResolvedValueOnce(null);

        await expect(useCase.execute("non-existent", "user-123")).rejects.toThrow(
            AppointmentRequestNotFoundException,
        );
        expect(mockRequestRepo.findById).toHaveBeenCalledWith("non-existent");
    });

    it("should throw OwnerNotFoundException when owner is not found", async () => {
        const existingRequest = createMockRequest();
        mockRequestRepo.findById.mockResolvedValueOnce(existingRequest);
        mockOwnerRepo.findByUserId.mockResolvedValueOnce(null);
        mockOwnerRepo.findById.mockResolvedValueOnce(null);

        await expect(useCase.execute("req-123", "unknown-user")).rejects.toThrow(
            OwnerNotFoundException,
        );
        expect(mockRequestRepo.updateStatus).not.toHaveBeenCalled();
    });

    it("should throw CannotCancelAppointmentRequestException when request is not in PENDING status", async () => {
        const approvedRequest = createMockRequest({ status: "APPROVED", ownerId: "owner-123" });
        mockRequestRepo.findById.mockResolvedValueOnce(approvedRequest);
        mockOwnerRepo.findByUserId.mockResolvedValueOnce(mockOwner);

        await expect(useCase.execute("req-123", "user-123")).rejects.toThrow(
            CannotCancelAppointmentRequestException,
        );
        expect(mockRequestRepo.updateStatus).not.toHaveBeenCalled();
    });

    it("should throw CannotCancelAppointmentRequestException when caller is not the owner of the request", async () => {
        const differentOwner = OwnerEntity.create({
            id: "owner-other",
            address: "Calle Falsa 123",
            phone: "+5491199999999",
            userId: "user-other",
        });

        const existingRequest = createMockRequest({ status: "PENDING", ownerId: "owner-123" });
        mockRequestRepo.findById.mockResolvedValueOnce(existingRequest);
        mockOwnerRepo.findByUserId.mockResolvedValueOnce(differentOwner);

        await expect(useCase.execute("req-123", "user-other")).rejects.toThrow(
            CannotCancelAppointmentRequestException,
        );
        expect(mockRequestRepo.updateStatus).not.toHaveBeenCalled();
    });
});
