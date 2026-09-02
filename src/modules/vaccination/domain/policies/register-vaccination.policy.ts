import { VaccinationEntity } from "../entities";

export class RegisterVaccinationPolicy {
    // Each vaccination appointment/session lasts 1 hour and 30 minutes (90 minutes)
    private static readonly VACCINATION_DURATION_MS = 90 * 60 * 1000;

    static canRegisterByDateAdministered(vaccinations: VaccinationEntity[], date?: Date): boolean {
        if (!date) return false;
        const newStart = date.getTime();
        const newEnd = newStart + RegisterVaccinationPolicy.VACCINATION_DURATION_MS;

        return !vaccinations.some(vaccination => {
            const existingStart = vaccination.getDateAdministered().getTime();
            const existingEnd = existingStart + RegisterVaccinationPolicy.VACCINATION_DURATION_MS;

            // Check if proposed vaccination interval [newStart, newEnd) overlaps
            // with existing vaccination interval [existingStart, existingEnd)
            return newStart < existingEnd && newEnd > existingStart;
        });
    }

    static canRegisterByNextDueDate(vaccinations: VaccinationEntity[], date?: Date): boolean {
        if (!date) return false;
        const newStart = date.getTime();
        const newEnd = newStart + RegisterVaccinationPolicy.VACCINATION_DURATION_MS;

        return !vaccinations.some(vaccination => {
            const existingStart = vaccination.getNextDueDate()?.getTime();
            if (!existingStart) return false;
            const existingEnd = existingStart + RegisterVaccinationPolicy.VACCINATION_DURATION_MS;

            return newStart < existingEnd && newEnd > existingStart;
        });
    }

    static canRegisterByDate(vaccinations: VaccinationEntity[], dateAdministered?: Date, nextDueDate?: Date): boolean {
        if (!RegisterVaccinationPolicy.canRegisterByDateAdministered(vaccinations, dateAdministered)
            || !RegisterVaccinationPolicy.canRegisterByNextDueDate(vaccinations, dateAdministered)
            || !RegisterVaccinationPolicy.canRegisterByNextDueDate(vaccinations, nextDueDate)
            || !RegisterVaccinationPolicy.canRegisterByNextDueDate(vaccinations, nextDueDate)) {
            return false;
        }

        return true;
    }
}
