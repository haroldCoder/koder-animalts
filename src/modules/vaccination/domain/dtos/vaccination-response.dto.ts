export interface ResponseVaccinationDto {
    id: string;
    vaccineName: string;
    dateAdministered: string;
    nextDueDate: string;
    lotNumber: string;
    createdAt: string;
    medicalRecordId: string;
    medicalRecord: {
        pet: {
            name: string;
        }
    }
}
