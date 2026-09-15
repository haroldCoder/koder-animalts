import { UpdateClinicPolicy } from "./update-clinic.policy";
import { AppointmentEntity } from "@appointment/domain/entities";
import { AppointmentStatus } from "@appointment/domain/enums/appointment-status.enum";

describe("UpdateClinicPolicy", () => {
    const createMockAppointment = (status: AppointmentStatus): AppointmentEntity => {
        return AppointmentEntity.create({
            id: "app-1",
            date: new Date("2026-09-20T10:00:00Z"),
            reason: "General Consultation",
            status,
            petId: "pet-1",
            veterinarianId: "vet-1",
        });
    };

    it("should allow clinic update when pet has no appointments", () => {
        const result = UpdateClinicPolicy.canUpdateClinicByAppointments([]);
        expect(result).toBe(true);
    });

    it("should allow clinic update when all appointments are CANCELLED", () => {
        const appointments = [
            createMockAppointment(AppointmentStatus.CANCELLED),
            createMockAppointment(AppointmentStatus.CANCELLED),
        ];

        const result = UpdateClinicPolicy.canUpdateClinicByAppointments(appointments);
        expect(result).toBe(true);
    });

    it("should allow clinic update when all appointments are COMPLETED", () => {
        const appointments = [
            createMockAppointment(AppointmentStatus.COMPLETED),
            createMockAppointment(AppointmentStatus.COMPLETED),
        ];

        const result = UpdateClinicPolicy.canUpdateClinicByAppointments(appointments);
        expect(result).toBe(true);
    });

    it("should allow clinic update when appointments are a mix of COMPLETED and CANCELLED", () => {
        const appointments = [
            createMockAppointment(AppointmentStatus.COMPLETED),
            createMockAppointment(AppointmentStatus.CANCELLED),
        ];

        const result = UpdateClinicPolicy.canUpdateClinicByAppointments(appointments);
        expect(result).toBe(true);
    });

    it("should reject clinic update when there is at least one SCHEDULED appointment", () => {
        const appointments = [
            createMockAppointment(AppointmentStatus.COMPLETED),
            createMockAppointment(AppointmentStatus.SCHEDULED),
        ];

        const result = UpdateClinicPolicy.canUpdateClinicByAppointments(appointments);
        expect(result).toBe(false);
    });

    it("should reject clinic update when all appointments are SCHEDULED", () => {
        const appointments = [
            createMockAppointment(AppointmentStatus.SCHEDULED),
        ];

        const result = UpdateClinicPolicy.canUpdateClinicByAppointments(appointments);
        expect(result).toBe(false);
    });
});
