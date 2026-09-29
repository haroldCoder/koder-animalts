export class MedicalRecordAlreadyExistsWithAppointmentException extends Error {
    constructor() {
        super("Medical record already exists with this appointment");
        this.name = "MedicalRecordAlreadyExistsWithAppointmentException";
    }
}