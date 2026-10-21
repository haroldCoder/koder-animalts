import { LocalStorageStore as CommonLocalStorageStore } from "@/common/infrastructure/persistence";

export interface StoredPet {
    id: string;
    name: string;
    species: string;
    breed?: string | null;
    gender?: string | null;
    birthDate?: string | null;
    weight?: number | null;
    color?: string | null;
    microchip?: string | null;
    isActive: boolean;
    mainImage: string;
    iaImage?: string | null;
    images: string[];
    ownerId: string;
    clinicId: string;
    createdAt: string;
    updatedAt: string;
}

export interface StoredPetBackground {
    id: string;
    petId: string;
    provenance?: string | null;
    dietType?: string | null;
    dietDetails?: string | null;
    isNeutered: boolean;
    neuteredDate?: string | null;
    previousIllnesses?: string | null;
    hasAllergies: boolean;
    allergiesDescription?: string | null;
    lastVaccinationDate?: string | null;
    coreVaccines?: any | null;
    lastDewormingInternal?: string | null;
    lastDewormingExternal?: string | null;
    otherPreventiveNotes?: string | null;
    createdAt: string;
    updatedAt: string;
}

export class LocalPetStore {
    private static instance: LocalPetStore;

    private readonly commonStore: CommonLocalStorageStore;
    private pets = new Map<string, StoredPet>();
    private petBackgrounds = new Map<string, StoredPetBackground>();

    private constructor() {
        this.commonStore = CommonLocalStorageStore.getInstance();
        this.loadFromFile();
        if (this.pets.size === 0) {
            this.initDefaultSeedData();
            this.persist();
        }
    }

    public static getInstance(): LocalPetStore {
        if (!LocalPetStore.instance) {
            LocalPetStore.instance = new LocalPetStore();
        }
        return LocalPetStore.instance;
    }

    public initDefaultSeedData(): void {
        const clinicId = "11111111-1111-4111-8111-111111111111";

        if (!this.pets.has("pet-001")) {
            this.pets.set("pet-001", {
                id: "pet-001",
                name: "Max",
                species: "Canino",
                breed: "Golden Retriever",
                gender: "MALE",
                birthDate: "2021-06-15T00:00:00.000Z",
                weight: 25.5,
                color: "Dorado",
                microchip: "981020000123456",
                isActive: true,
                mainImage: "https://images.unsplash.com/photo-1552053831-71594a27632d",
                images: [],
                ownerId: "owner-001",
                clinicId: clinicId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }
        if (!this.petBackgrounds.has("pet-001")) {
            this.petBackgrounds.set("pet-001", {
                id: "bg-001",
                petId: "pet-001",
                provenance: "Adopción",
                dietType: "Concentrado",
                dietDetails: "Purina Pro Plan",
                isNeutered: true,
                neuteredDate: "2022-03-10T00:00:00.000Z",
                previousIllnesses: "Gastroenteritis leve en 2022",
                hasAllergies: false,
                allergiesDescription: null,
                lastVaccinationDate: "2024-01-15T00:00:00.000Z",
                coreVaccines: {
                    canineVaccines: {
                        rabies: true,
                        distemper: true,
                        parvovirus: true,
                        adenovirus: true,
                        parainfluenza: false,
                        leptospirosis: true,
                    },
                    deworming: {
                        internalParasites: true,
                        externalParasites: true,
                        lastInternalDewormingDate: "2024-02-01T00:00:00.000Z",
                        lastExternalDewormingDate: "2024-02-01T00:00:00.000Z",
                    },
                },
                lastDewormingInternal: "2024-02-01T00:00:00.000Z",
                lastDewormingExternal: "2024-02-01T00:00:00.000Z",
                otherPreventiveNotes: "Antiparasitario Nexgard Spectra mensual",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }
    }

    public persist(): void {
        this.commonStore.setSlice("pets", Array.from(this.pets.values()));
        this.commonStore.setSlice("petBackgrounds", Array.from(this.petBackgrounds.values()));
    }

    public loadFromFile(): void {
        const pets = this.commonStore.getSlice<StoredPet>("pets");
        if (Array.isArray(pets)) {
            pets.forEach(p => this.pets.set(p.id, p));
        }

        const backgrounds = this.commonStore.getSlice<StoredPetBackground>("petBackgrounds");
        if (Array.isArray(backgrounds)) {
            backgrounds.forEach(bg => this.petBackgrounds.set(bg.petId, bg));
        }
    }

    public clear(): void {
        this.pets.clear();
        this.petBackgrounds.clear();
        this.initDefaultSeedData();
        this.persist();
    }

    // --- Pets ---
    public savePet(pet: StoredPet): void {
        this.pets.set(pet.id, pet);
        this.persist();
    }

    public findPetById(id: string): StoredPet | null {
        return this.pets.get(id) || null;
    }

    public deletePet(id: string): void {
        this.pets.delete(id);
        this.petBackgrounds.delete(id);
        this.persist();
    }

    public getAllPets(): StoredPet[] {
        return Array.from(this.pets.values());
    }

    public findPetsByOwnerId(ownerId: string): StoredPet[] {
        return Array.from(this.pets.values()).filter(p => p.ownerId === ownerId);
    }

    public findPetsByClinicId(clinicId: string): StoredPet[] {
        const isClinic1 = clinicId === "clinic-001" || clinicId === "11111111-1111-4111-8111-111111111111";
        const isClinic2 = clinicId === "clinic-002" || clinicId === "22222222-2222-4222-8222-222222222222";

        return Array.from(this.pets.values()).filter(p => {
            if (p.clinicId === clinicId) return true;
            if (isClinic1 && (p.clinicId === "clinic-001" || p.clinicId === "11111111-1111-4111-8111-111111111111")) return true;
            if (isClinic2 && (p.clinicId === "clinic-002" || p.clinicId === "22222222-2222-4222-8222-222222222222")) return true;
            return false;
        });
    }

    // --- Pet Backgrounds ---
    public findBackgroundByPetId(petId: string): StoredPetBackground | null {
        return this.petBackgrounds.get(petId) || null;
    }

    public upsertPetBackground(background: StoredPetBackground): StoredPetBackground {
        this.petBackgrounds.set(background.petId, background);
        this.persist();
        return background;
    }

    public deleteBackgroundByPetId(petId: string): void {
        this.petBackgrounds.delete(petId);
        this.persist();
    }
}
