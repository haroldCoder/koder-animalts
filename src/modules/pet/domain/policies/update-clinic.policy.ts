import { AppointmentEntity } from "@appointment/domain/entities";
import { AppointmentStatus } from "@appointment/domain/enums/appointment-status.enum";

export class UpdateClinicPolicy {
    static canUpdateClinicByAppointments(appointmentsPet: AppointmentEntity[]): boolean {
        if (appointmentsPet.length == 0) return true;

        return appointmentsPet.every(appointment =>
            appointment.getStatus() == AppointmentStatus.CANCELLED ||
            appointment.getStatus() == AppointmentStatus.COMPLETED)
    }
}