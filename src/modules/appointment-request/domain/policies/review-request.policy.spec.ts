import { AppointmentRequestEntity } from "../entities";
import { ReviewRequestPolicy } from "./review-request.policy";

describe("ReviewRequestPolicy", () => {
    const createMockRequest = (overrides?: Partial<AppointmentRequestEntity>): AppointmentRequestEntity => {
        return new AppointmentRequestEntity(
            overrides?.id ?? "req-1",
            overrides?.ownerId ?? "owner-1",
            overrides?.petId ?? "pet-1",
            overrides?.clinicId ?? "clinic-1",
            overrides?.reason ?? "Checkup",
            overrides?.requestedDate ?? new Date("2026-10-01T10:00:00Z"),
            overrides?.status ?? "PENDING",
            overrides?.veterinarianId,
            overrides?.reviewedById,
            overrides?.rejectionReason,
        );
    };

    describe("canCancel", () => {
        it("should return true when the request is PENDING and the ownerId matches", () => {
            const request = createMockRequest({ ownerId: "owner-1", status: "PENDING" });
            const result = ReviewRequestPolicy.canCancel(request, "owner-1");
            expect(result).toBe(true);
        });

        it("should return false when the request is not PENDING (e.g. APPROVED)", () => {
            const request = createMockRequest({ ownerId: "owner-1", status: "APPROVED" });
            const result = ReviewRequestPolicy.canCancel(request, "owner-1");
            expect(result).toBe(false);
        });

        it("should return false when the request is not PENDING (e.g. REJECTED)", () => {
            const request = createMockRequest({ ownerId: "owner-1", status: "REJECTED" });
            const result = ReviewRequestPolicy.canCancel(request, "owner-1");
            expect(result).toBe(false);
        });

        it("should return false when the request is already CANCELLED", () => {
            const request = createMockRequest({ ownerId: "owner-1", status: "CANCELLED" });
            const result = ReviewRequestPolicy.canCancel(request, "owner-1");
            expect(result).toBe(false);
        });

        it("should return false when the ownerId does not match", () => {
            const request = createMockRequest({ ownerId: "owner-1", status: "PENDING" });
            const result = ReviewRequestPolicy.canCancel(request, "owner-other");
            expect(result).toBe(false);
        });
    });

    describe("canApprove", () => {
        it("should return true when request is PENDING and clinicId matches", () => {
            const request = createMockRequest({ clinicId: "clinic-1", status: "PENDING" });
            const result = ReviewRequestPolicy.canApprove(request, "clinic-1");
            expect(result).toBe(true);
        });

        it("should return false when request is not PENDING", () => {
            const request = createMockRequest({ clinicId: "clinic-1", status: "APPROVED" });
            const result = ReviewRequestPolicy.canApprove(request, "clinic-1");
            expect(result).toBe(false);
        });

        it("should return false when clinicId does not match", () => {
            const request = createMockRequest({ clinicId: "clinic-1", status: "PENDING" });
            const result = ReviewRequestPolicy.canApprove(request, "clinic-different");
            expect(result).toBe(false);
        });
    });
});
