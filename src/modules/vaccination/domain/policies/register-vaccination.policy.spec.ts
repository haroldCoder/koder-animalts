import { RegisterVaccinationPolicy } from "./register-vaccination.policy";
import { VaccinationEntity } from "../entities";
import { VaccinationStatus } from "../enums";

describe("RegisterVaccinationPolicy", () => {
    const createMockVaccination = (id: string, dateAdministered: Date): VaccinationEntity => {
        return VaccinationEntity.create({
            id,
            vaccineName: "Rabies",
            dateAdministered,
            lotNumber: "LOT-123",
            medicalRecordId: "rec-1",
            veterinarianId: "vet-1",
            status: VaccinationStatus.PENDING,
        });
    };

    it("should allow registration when there are no existing vaccinations", () => {
        const result = RegisterVaccinationPolicy.canRegisterByDate([], new Date("2026-09-02T10:00:00Z"));
        expect(result).toBe(true);
    });

    it("should reject registration at the exact same date and time", () => {
        const date = new Date("2026-09-02T10:00:00Z");
        const existing = [createMockVaccination("vac-1", date)];

        const result = RegisterVaccinationPolicy.canRegisterByDate(existing, new Date("2026-09-02T10:00:00Z"));
        expect(result).toBe(false);
    });

    it("should reject registration if less than 1 hour and 30 minutes after an existing vaccination", () => {
        const baseDate = new Date("2026-09-02T10:00:00Z");
        const existing = [createMockVaccination("vac-1", baseDate)];

        // 1 hour after baseDate (11:00) -> overlaps
        const result = RegisterVaccinationPolicy.canRegisterByDate(existing, new Date("2026-09-02T11:00:00Z"));
        expect(result).toBe(false);
    });

    it("should allow registration when exactly 1 hour and 30 minutes after an existing vaccination", () => {
        const baseDate = new Date("2026-09-02T10:00:00Z");
        const existing = [createMockVaccination("vac-1", baseDate)];

        // 1.5 hours (90 mins) after baseDate (11:30) -> no overlap
        const result = RegisterVaccinationPolicy.canRegisterByDate(existing, new Date("2026-09-02T11:30:00Z"));
        expect(result).toBe(true);
    });

    it("should reject 13:30 registration if existing vaccinations are at 12:00 and 14:00", () => {
        const v12 = createMockVaccination("vac-12", new Date("2026-09-02T12:00:00Z"));
        const v14 = createMockVaccination("vac-14", new Date("2026-09-02T14:00:00Z"));
        const existing = [v12, v14];

        // 13:30 to 15:00 overlaps with 14:00 to 15:30
        const result = RegisterVaccinationPolicy.canRegisterByDate(existing, new Date("2026-09-02T13:30:00Z"));
        expect(result).toBe(false);
    });
});
