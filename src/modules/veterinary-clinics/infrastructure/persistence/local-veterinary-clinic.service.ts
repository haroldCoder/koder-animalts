import { Injectable } from "@nestjs/common";
import { IVeterinaryClinicRepository } from "@veterinary-clinics/domain/ports";
import { VeterinaryClinicEntity } from "@veterinary-clinics/domain/entities";
import { ResponseFindVeterinariansDto } from "@veterinary-clinics/domain/dtos";
import { VeterinaryClinicSummaryModel } from "@veterinary-clinics/domain/models";
import { LocalStorageStore } from "@auth/infrastructure/persistence";

@Injectable()
export class LocalVeterinaryClinicService implements IVeterinaryClinicRepository {
    private readonly store: LocalStorageStore;

    constructor() {
        this.store = LocalStorageStore.getInstance();
    }

    async create(data: VeterinaryClinicEntity): Promise<string> {
        (this.store as any).clinics?.set(data.getId(), {
            id: data.getId(),
            name: data.getName(),
            email: data.getEmail() ?? undefined,
            phone: data.getPhone() ?? undefined,
            address: data.getAddress(),
        });
        this.store.persist();
        return data.getId();
    }

    async findAll(): Promise<VeterinaryClinicEntity[]> {
        const clinics = this.store.getAllClinics();
        return clinics.map(c => VeterinaryClinicEntity.create({
            id: c.id,
            name: c.name,
            address: c.address || "Av Principal # 1-23",
            email: c.email || "clinic@vet.com",
            phone: c.phone || "3001234567",
        }));
    }

    async findById(id: string): Promise<VeterinaryClinicEntity | null> {
        const clinics = this.store.getAllClinics();
        const found = clinics.find(c => c.id === id);
        if (!found) return null;

        return VeterinaryClinicEntity.create({
            id: found.id,
            name: found.name,
            address: found.address || "Av Principal # 1-23",
            email: found.email || "clinic@vet.com",
            phone: found.phone || "3001234567",
        });
    }

    async findAllVeterinariansOfClinic(clinicId: string): Promise<ResponseFindVeterinariansDto[]> {
        const vets = Array.from((this.store as any).veterinarians?.values() || [])
            .filter((v: any) => v.clinicId === clinicId) as any[];

        return vets.map((v: any) => {
            const user = this.store.findUserById(v.userId);
            return {
                id: v.id,
                name: user?.getName() || "",
                image: user?.getImage() || "",
            };
        });
    }

    async getSummaryByVeterinarianUserId(userId: string): Promise<VeterinaryClinicSummaryModel> {
        const vet = this.store.findVeterinarianByUserId(userId);
        const clinic = vet ? this.store.getAllClinics().find(c => c.id === vet.clinicId) : null;

        return {
            totalPets: 0,
            totalUsers: 1,
            clinicName: clinic?.name || "Clínica Veterinaria San Roque",
        };
    }
}
