import { Test, TestingModule } from "@nestjs/testing";
import { AppointmentRequestController } from "./appointment-request.controller";
import {
    CreateAppointmentRequestUseCase,
    ApproveAppointmentRequestUseCase,
    RejectAppointmentRequestUseCase,
    CancelAppointmentRequestUseCase,
    FindAppointmentsRequestUseCase,
} from "../../application/use-cases";
import { AppointmentRequestEntity } from "../../domain/entities";
import { HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { CannotCancelAppointmentRequestException } from "../../domain/exceptions";

describe("AppointmentRequestController", () => {
    let controller: AppointmentRequestController;
    let cancelUC: jest.Mocked<CancelAppointmentRequestUseCase>;

    const mockCreateUC = { execute: jest.fn() };
    const mockApproveUC = { execute: jest.fn() };
    const mockRejectUC = { execute: jest.fn() };
    const mockCancelUC = { execute: jest.fn() };
    const mockFindUC = { execute: jest.fn() };

    const mockCancelledRequest = new AppointmentRequestEntity(
        "req-1",
        "owner-1",
        "pet-1",
        "clinic-1",
        "Routine checkup",
        new Date("2026-10-15T10:00:00Z"),
        "CANCELLED",
    );

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppointmentRequestController],
            providers: [
                { provide: CreateAppointmentRequestUseCase, useValue: mockCreateUC },
                { provide: ApproveAppointmentRequestUseCase, useValue: mockApproveUC },
                { provide: RejectAppointmentRequestUseCase, useValue: mockRejectUC },
                { provide: CancelAppointmentRequestUseCase, useValue: mockCancelUC },
                { provide: FindAppointmentsRequestUseCase, useValue: mockFindUC },
            ],
        }).compile();

        controller = module.get<AppointmentRequestController>(AppointmentRequestController);
        cancelUC = module.get(CancelAppointmentRequestUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("cancel", () => {
        it("should cancel appointment request using authenticated user id", async () => {
            mockCancelUC.execute.mockResolvedValueOnce(mockCancelledRequest);

            const result = await controller.cancel("req-1", { id: "user-123" });

            expect(cancelUC.execute).toHaveBeenCalledWith("req-1", "user-123");
            expect(result.statusCode).toBe(HttpStatus.OK);
            expect(result.message).toBe("Appointment request cancelled successfully");
            expect(result.data).toEqual(mockCancelledRequest);
        });

        it("should cancel appointment request using ownerUserId query param if user is not present", async () => {
            mockCancelUC.execute.mockResolvedValueOnce(mockCancelledRequest);

            const result = await controller.cancel("req-1", null, "user-fallback");

            expect(cancelUC.execute).toHaveBeenCalledWith("req-1", "user-fallback");
            expect(result.statusCode).toBe(HttpStatus.OK);
            expect(result.data).toEqual(mockCancelledRequest);
        });

        it("should re-throw HttpException if use case throws HttpException", async () => {
            const forbiddenError = new CannotCancelAppointmentRequestException();
            mockCancelUC.execute.mockRejectedValueOnce(forbiddenError);

            await expect(controller.cancel("req-1", { id: "user-123" })).rejects.toThrow(
                CannotCancelAppointmentRequestException,
            );
        });

        it("should throw InternalServerErrorException on unexpected error", async () => {
            mockCancelUC.execute.mockRejectedValueOnce(new Error("Database connection lost"));

            await expect(controller.cancel("req-1", { id: "user-123" })).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });
});
