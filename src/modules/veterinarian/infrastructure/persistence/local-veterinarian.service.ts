import { Injectable } from "@nestjs/common";
import { IVeterinarianRepository } from "@veterinarian/domain/ports";
import { VeterinarianEntity } from "@veterinarian/domain/entities";
import { VeterinarianAlreadyExistsException } from "@veterinarian/domain/exceptions";
import { UserIdNotFoundException, VeterinarianIdNotFoundException, VeterinarianIdNotExistException } from "@/common/domain/exceptions";
import { LocalStorageStore } from "@auth/infrastructure/persistence";

@Injectable()
export class LocalVeterinarianService implements IVeterinarianRepository {
    private readonly store: LocalStorageStore;

    constructor() {
        this.store = LocalStorageStore.getInstance();
    }

    async create(veterinarian: VeterinarianEntity): Promise<string> {
        const existing = this.store.findVeterinarianByUserId(veterinarian.getUserId());
        if (existing) throw new VeterinarianAlreadyExistsException();

        return this.store.createVeterinarianProfile(veterinarian.getUserId(), {
            clinicId: veterinarian.getClinicId(),
            phone: veterinarian.getPhone(),
            specialty: veterinarian.getSpecialty(),
        });
    }

    async findByIdWithDetails(id: string): Promise<VeterinarianEntity | null> {
        if (!id) throw new VeterinarianIdNotFoundException();

        let foundVet: any = null;
        for (const vet of (this.store as any).veterinarians?.values() || []) {
            if (vet.id === id) {
                foundVet = vet;
                break;
            }
        }

        if (!foundVet) return null;

        const user = this.store.findUserById(foundVet.userId);
        const clinic = this.store.getAllClinics().find(c => c.id === foundVet.clinicId);

        return VeterinarianEntity.create({
            id: foundVet.id,
            phone: foundVet.phone,
            specialty: foundVet.specialty,
            userId: foundVet.userId,
            clinicId: foundVet.clinicId,
            createdAt: new Date(foundVet.createdAt),
            updatedAt: new Date(foundVet.updatedAt),
            user: user ? {
                id: user.getId(),
                name: user.getName() || "",
                email: user.getEmailValue(),
            } : undefined,
            clinic: clinic ? {
                id: clinic.id,
                name: clinic.name,
            } : undefined,
        });
    }

    async findByUserId(userId: string): Promise<VeterinarianEntity | null> {
        if (!userId) throw new UserIdNotFoundException();

        const vet = this.store.findVeterinarianByUserId(userId);
        if (!vet) return null;

        const user = this.store.findUserById(userId);
        const clinic = this.store.getAllClinics().find(c => c.id === vet.clinicId);

        return VeterinarianEntity.create({
            id: vet.id,
            phone: vet.phone,
            specialty: vet.specialty,
            userId: vet.userId,
            clinicId: vet.clinicId,
            createdAt: new Date(vet.createdAt),
            updatedAt: new Date(vet.updatedAt),
            user: user ? {
                id: user.getId(),
                name: user.getName() || "",
                email: user.getEmailValue(),
            } : undefined,
            clinic: clinic ? {
                id: clinic.id,
                name: clinic.name,
            } : undefined,
        });
    }

    async findClinicByVeterinarianId(veterinarianId: string): Promise<{ id: string; name: string } | null> {
        if (!veterinarianId) throw new VeterinarianIdNotFoundException();

        let foundVet: any = null;
        for (const vet of (this.store as any).veterinarians?.values() || []) {
            if (vet.id === veterinarianId) {
                foundVet = vet;
                break;
            }
        }

        if (!foundVet) throw new VeterinarianIdNotExistException();

        const clinic = this.store.getAllClinics().find(c => c.id === foundVet.clinicId);
        if (!clinic) return null;

        return {
            id: clinic.id,
            name: clinic.name,
        };
    }
}
