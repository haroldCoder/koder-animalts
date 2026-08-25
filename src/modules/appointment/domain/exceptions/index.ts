export class AppointmentDateNotFoundException extends Error {
    constructor() {
        super('Appointment date is required');
        this.name = 'AppointmentDateNotFoundException';
    }
}

export class AppointmentReasonNotFoundException extends Error {
    constructor() {
        super('Appointment reason is required');
        this.name = 'AppointmentReasonNotFoundException';
    }
}

export class AppointmentStatusNotFoundException extends Error {
    constructor() {
        super('Appointment status is required');
        this.name = 'AppointmentStatusNotFoundException';
    }
}

export class AppointmentIdNotFoundException extends Error {
    constructor() {
        super('Appointment ID is required');
        this.name = 'AppointmentIdNotFoundException';
    }
}

export class EarlyAppointmentStatusUpdateException extends Error {
    constructor() {
        super('Cannot update appointment status before the appointment date');
        this.name = 'EarlyAppointmentStatusUpdateException';
    }
}
