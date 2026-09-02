import { RegisterAppointmentPolicy } from "./register-appointment.policy";
import { AppointmentEntity } from "../entities";
import { AppointmentStatus } from "../enums/appointment-status.enum";

describe("RegisterAppointmentPolicy", () => {
    const createMockAppointment = (id: string, date: Date): AppointmentEntity => {
        return AppointmentEntity.create({
            id,
            date,
            reason: "General Checkup",
            status: AppointmentStatus.SCHEDULED,
            petId: "pet-1",
            veterinarianId: "vet-1",
        });
    };

    it("should allow registration when there are no existing appointments", () => {
        const result = RegisterAppointmentPolicy.canRegisterByDate([], new Date("2026-09-02T10:00:00Z"));
        expect(result).toBe(true);
    });

    it("should reject registration at the exact same date and time", () => {
        const date = new Date("2026-09-02T10:00:00Z");
        const existing = [createMockAppointment("app-1", date)];

        const result = RegisterAppointmentPolicy.canRegisterByDate(existing, new Date("2026-09-02T10:00:00Z"));
        expect(result).toBe(false);
    });

    it("should reject registration if less than 1 hour and 30 minutes after an existing appointment", () => {
        const baseDate = new Date("2026-09-02T10:00:00Z");
        const existing = [createMockAppointment("app-1", baseDate)];

        // 1 hour after baseDate (11:00) -> 60 mins < 90 mins
        const result = RegisterAppointmentPolicy.canRegisterByDate(existing, new Date("2026-09-02T11:00:00Z"));
        expect(result).toBe(false);
    });

    it("should reject registration if less than 1 hour and 30 minutes before an existing appointment", () => {
        const baseDate = new Date("2026-09-02T10:00:00Z");
        const existing = [createMockAppointment("app-1", baseDate)];

        // 45 mins before baseDate (09:15) -> 45 mins < 90 mins
        const result = RegisterAppointmentPolicy.canRegisterByDate(existing, new Date("2026-09-02T09:15:00Z"));
        expect(result).toBe(false);
    });

    it("should allow registration when exactly 1 hour and 30 minutes after an existing appointment", () => {
        const baseDate = new Date("2026-09-02T10:00:00Z");
        const existing = [createMockAppointment("app-1", baseDate)];

        // 1.5 hours (90 mins) after baseDate (11:30)
        const result = RegisterAppointmentPolicy.canRegisterByDate(existing, new Date("2026-09-02T11:30:00Z"));
        expect(result).toBe(true);
    });

    it("should allow registration when exactly 1 hour and 30 minutes before an existing appointment", () => {
        const baseDate = new Date("2026-09-02T10:00:00Z");
        const existing = [createMockAppointment("app-1", baseDate)];

        // 1.5 hours (90 mins) before baseDate (08:30)
        const result = RegisterAppointmentPolicy.canRegisterByDate(existing, new Date("2026-09-02T08:30:00Z"));
        expect(result).toBe(true);
    });

    it("should reject 13:30 appointment if there is an appointment at 12:00 and another at 14:00 (user example)", () => {
        const appointment12 = createMockAppointment("app-12", new Date("2026-09-02T12:00:00Z"));
        const appointment14 = createMockAppointment("app-14", new Date("2026-09-02T14:00:00Z"));
        const existing = [appointment12, appointment14];

        // 13:30 to 15:00 would overlap with 14:00 to 15:30
        const result = RegisterAppointmentPolicy.canRegisterByDate(existing, new Date("2026-09-02T13:30:00Z"));
        expect(result).toBe(false);
    });

    it("should allow 13:30 appointment if existing appointments are at 12:00 and 15:00", () => {
        const appointment12 = createMockAppointment("app-12", new Date("2026-09-02T12:00:00Z"));
        const appointment15 = createMockAppointment("app-15", new Date("2026-09-02T15:00:00Z"));
        const existing = [appointment12, appointment15];

        // 13:30 to 15:00 fits perfectly between 12:00-13:30 and 15:00-16:30
        const result = RegisterAppointmentPolicy.canRegisterByDate(existing, new Date("2026-09-02T13:30:00Z"));
        expect(result).toBe(true);
    });
});
