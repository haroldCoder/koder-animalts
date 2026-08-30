export interface ResponseVaccinationDto {
    id: string;
    vaccineName: string;
    dateAdministered: string;
    nextDueDate: string;
    lotNumber: string;
    createdAt: string;
    status: string;
    medicalRecordId: string;
    medicalRecord: {
        pet: {
            name: string;
        }
    }
    veterinarian: {
        id: string;
        name: string;
    }
}
