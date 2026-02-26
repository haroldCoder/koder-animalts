export interface VaccinationEntity {
    id: string;
    vaccineName: string;
    dateAdministered: Date;
    nextDueDate: Date | null;
    lotNumber: string | null;
    createdAt: Date;
    medicalRecordId: string;
}
