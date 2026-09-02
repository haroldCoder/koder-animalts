import { AppointmentEntity } from "../entities";

export class RegisterAppointmentPolicy {
    // Each appointment lasts 1 hour and 30 minutes (90 minutes)
    private static readonly APPOINTMENT_DURATION_MS = 90 * 60 * 1000;

    static canRegisterByDate(appointments: AppointmentEntity[], date: Date): boolean {
        const newStart = date.getTime();
        const newEnd = newStart + RegisterAppointmentPolicy.APPOINTMENT_DURATION_MS;

        return !appointments.some(appointment => {
            const existingStart = appointment.getDate().getTime();
            const existingEnd = existingStart + RegisterAppointmentPolicy.APPOINTMENT_DURATION_MS;

            // Check if the proposed appointment interval [newStart, newEnd) overlaps
            // with an existing appointment interval [existingStart, existingEnd)
            return newStart < existingEnd && newEnd > existingStart;
        });
    }
}