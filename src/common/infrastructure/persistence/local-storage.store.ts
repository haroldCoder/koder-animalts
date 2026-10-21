import { randomUUID } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

export interface StoredClinic {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
}

export interface StoredOwner {
    id: string;
    userId: string;
    phone: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}

export interface StoredVeterinarian {
    id: string;
    userId: string;
    clinicId: string;
    phone: string;
    specialty?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LocalStorageSnapshot {
    clinics: StoredClinic[];
    owners: StoredOwner[];
    veterinarians: StoredVeterinarian[];
    [key: string]: any;
}

export class LocalStorageStore {
    private static instance: LocalStorageStore;

    private readonly storageFilePath: string;
    private clinics = new Map<string, StoredClinic>();
    private owners = new Map<string, StoredOwner>();
    private veterinarians = new Map<string, StoredVeterinarian>();
    private dataSlices = new Map<string, any[]>();
    private clearHooks: Array<() => void> = [];

    private constructor() {
        this.storageFilePath = resolve(process.cwd(), ".test-local-storage.json");
        this.initDefaultClinics();
        this.initDefaultProfiles();
        this.loadFromFile();
    }

    public static getInstance(): LocalStorageStore {
        if (!LocalStorageStore.instance) {
            LocalStorageStore.instance = new LocalStorageStore();
        }
        return LocalStorageStore.instance;
    }

    public registerClearHook(hook: () => void): void {
        this.clearHooks.push(hook);
    }

    private initDefaultClinics(): void {
        const defaultClinic1 = {
            id: "11111111-1111-4111-8111-111111111111",
            name: "Clínica Veterinaria San Roque",
            email: "sanroque@vet.com",
            phone: "3009876543",
            address: "Av Central 123",
        };
        const defaultClinic2 = {
            id: "22222222-2222-4222-8222-222222222222",
            name: "Hospital Veterinario Animal Care",
            email: "contacto@animalcare.com",
            phone: "3111234567",
            address: "Calle 45 # 12-34",
        };

        this.clinics.set(defaultClinic1.id, defaultClinic1);
        this.clinics.set(defaultClinic2.id, defaultClinic2);
        this.clinics.set("clinic-001", {
            ...defaultClinic1,
            id: "clinic-001",
        });
        this.clinics.set("clinic-002", {
            ...defaultClinic2,
            id: "clinic-002",
        });
    }

    private initDefaultProfiles(): void {
        const clinicId = "11111111-1111-4111-8111-111111111111";

        // Veterinario por defecto
        const vetUserId = "99999999-9999-4999-a999-999999999999";
        const vetId = "88888888-8888-4888-a888-888888888888";
        const vetRecord: StoredVeterinarian = {
            id: vetId,
            userId: vetUserId,
            clinicId,
            phone: "3007654321",
            specialty: "Medicina General",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.veterinarians.set(vetId, vetRecord);
        this.veterinarians.set("vet-001", {
            ...vetRecord,
            id: "vet-001",
            userId: "user-vet-001",
            clinicId,
        });

        // Dueño por defecto
        const ownerUserId = "77777777-7777-4777-a777-777777777777";
        const ownerId = "66666666-6666-4666-a666-666666666666";
        const ownerRecord: StoredOwner = {
            id: ownerId,
            userId: ownerUserId,
            phone: "3001234567",
            address: "Calle 100 # 20-30",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.owners.set(ownerId, ownerRecord);
        this.owners.set("owner-001", {
            ...ownerRecord,
            id: "owner-001",
            userId: "user-owner-001",
        });
    }

    public persist(): void {
        try {
            const snapshot: Record<string, any> = {
                clinics: Array.from(this.clinics.values()),
                owners: Array.from(this.owners.values()),
                veterinarians: Array.from(this.veterinarians.values()),
            };

            for (const [key, value] of this.dataSlices.entries()) {
                snapshot[key] = value;
            }

            writeFileSync(this.storageFilePath, JSON.stringify(snapshot, null, 2), "utf-8");
        } catch (error) {
            console.warn("⚠️ [LocalStorageStore] Error al persistir archivo local:", (error as Error).message);
        }
    }

    public loadFromFile(): void {
        try {
            if (!existsSync(this.storageFilePath)) {
                return;
            }

            const raw = readFileSync(this.storageFilePath, "utf-8").trim();
            if (!raw) {
                return;
            }

            const data: Record<string, any> = JSON.parse(raw);

            if (Array.isArray(data.clinics)) {
                data.clinics.forEach(c => this.clinics.set(c.id, c));
            }

            if (Array.isArray(data.owners)) {
                data.owners.forEach(o => this.owners.set(o.id, o));
            }

            if (Array.isArray(data.veterinarians)) {
                data.veterinarians.forEach(v => this.veterinarians.set(v.id, v));
            }

            for (const [key, value] of Object.entries(data)) {
                if (key !== "clinics" && key !== "owners" && key !== "veterinarians" && Array.isArray(value)) {
                    this.dataSlices.set(key, value);
                }
            }
        } catch (error) {
            console.warn("⚠️ [LocalStorageStore] Error al cargar archivo local:", (error as Error).message);
        }
    }

    public clear(): void {
        this.clinics.clear();
        this.owners.clear();
        this.veterinarians.clear();
        this.dataSlices.clear();
        this.initDefaultClinics();
        this.initDefaultProfiles();

        for (const hook of this.clearHooks) {
            try {
                hook();
            } catch (error) {
                console.warn("⚠️ [LocalStorageStore] Error en hook de clear:", (error as Error).message);
            }
        }

        this.persist();
    }

    // --- Data slices (para auth, pets, spa, etc.) ---
    public getSlice<T>(key: string): T[] {
        return (this.dataSlices.get(key) as T[]) || [];
    }

    public setSlice<T>(key: string, data: T[]): void {
        this.dataSlices.set(key, data);
        this.persist();
    }

    // --- Clinics ---
    public getAllClinics(): StoredClinic[] {
        return Array.from(this.clinics.values());
    }

    public findClinicById(id: string): StoredClinic | null {
        if (id === "clinic-001") return this.clinics.get("clinic-001") || this.clinics.get("11111111-1111-4111-8111-111111111111") || null;
        if (id === "clinic-002") return this.clinics.get("clinic-002") || this.clinics.get("22222222-2222-4222-8222-222222222222") || null;
        return this.clinics.get(id) || null;
    }

    public saveClinic(clinic: StoredClinic): void {
        this.clinics.set(clinic.id, clinic);
        this.persist();
    }

    // --- Owners ---
    public findOwnerById(id: string): StoredOwner | null {
        return this.owners.get(id) || null;
    }

    public findOwnerByUserId(userId: string): StoredOwner | null {
        for (const owner of this.owners.values()) {
            if (owner.userId === userId) return owner;
        }
        return null;
    }

    public createOwnerProfile(userId: string, data: { phone: string; address: string }): string {
        for (const owner of this.owners.values()) {
            if (owner.userId === userId) {
                owner.phone = data.phone;
                owner.address = data.address;
                owner.updatedAt = new Date().toISOString();
                this.persist();
                return owner.id;
            }
        }

        const ownerId = randomUUID();
        const now = new Date().toISOString();
        const owner: StoredOwner = {
            id: ownerId,
            userId,
            phone: data.phone,
            address: data.address,
            createdAt: now,
            updatedAt: now,
        };
        this.owners.set(ownerId, owner);
        this.persist();
        return ownerId;
    }

    // --- Veterinarians ---
    public findVeterinarianById(id: string): StoredVeterinarian | null {
        return this.veterinarians.get(id) || null;
    }

    public findVeterinarianByUserId(userId: string): StoredVeterinarian | null {
        for (const vet of this.veterinarians.values()) {
            if (vet.userId === userId) return vet;
        }
        return null;
    }

    public createVeterinarianProfile(userId: string, data: {
        clinicId: string;
        phone: string;
        specialty?: string | null;
    }): string {
        for (const vet of this.veterinarians.values()) {
            if (vet.userId === userId) {
                vet.clinicId = data.clinicId;
                vet.phone = data.phone;
                vet.specialty = data.specialty ?? null;
                vet.updatedAt = new Date().toISOString();
                this.persist();
                return vet.id;
            }
        }

        const vetId = randomUUID();
        const now = new Date().toISOString();
        const vet: StoredVeterinarian = {
            id: vetId,
            userId,
            clinicId: data.clinicId,
            phone: data.phone,
            specialty: data.specialty ?? null,
            createdAt: now,
            updatedAt: now,
        };
        this.veterinarians.set(vetId, vet);
        this.persist();
        return vetId;
    }
}
