import { randomUUID } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { AccountEntity, SessionEntity, UserEntity } from "@auth/domain/entities";
import { UserRole } from "@user/domain/enums";
import { UserRoleInfo } from "@auth/domain/ports/auth.repository.types";

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

export interface StoredClinic {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
}

export interface LocalStorageSnapshot {
    users: Array<{ id: string; email: string; name?: string | null; image?: string | null }>;
    accounts: Array<{
        id: string;
        userId: string;
        providerId: string;
        accountId: string;
        password?: string | null;
        accessToken?: string | null;
        refreshToken?: string | null;
    }>;
    sessions: Array<{
        id: string;
        userId: string;
        token: string;
        expiresAt: string;
        ipAddress?: string | null;
        userAgent?: string | null;
    }>;
    owners: StoredOwner[];
    veterinarians: StoredVeterinarian[];
    clinics: StoredClinic[];
}

export class LocalStorageStore {
    private static instance: LocalStorageStore;

    private readonly storageFilePath: string;
    private users = new Map<string, UserEntity>();
    private accounts = new Map<string, AccountEntity>();
    private sessions = new Map<string, SessionEntity>();
    private owners = new Map<string, StoredOwner>();
    private veterinarians = new Map<string, StoredVeterinarian>();
    private clinics = new Map<string, StoredClinic>();

    private constructor() {
        this.storageFilePath = resolve(process.cwd(), ".test-local-storage.json");
        this.initDefaultClinics();
        this.loadFromFile();
    }

    public static getInstance(): LocalStorageStore {
        if (!LocalStorageStore.instance) {
            LocalStorageStore.instance = new LocalStorageStore();
        }
        return LocalStorageStore.instance;
    }

    private initDefaultClinics(): void {
        this.clinics.set("clinic-001", {
            id: "clinic-001",
            name: "Clínica Veterinaria San Roque",
            email: "sanroque@vet.com",
            phone: "3009876543",
            address: "Av Central 123",
        });
        this.clinics.set("clinic-002", {
            id: "clinic-002",
            name: "Hospital Veterinario Animal Care",
            email: "contacto@animalcare.com",
            phone: "3111234567",
            address: "Calle 45 # 12-34",
        });
    }

    public persist(): void {
        try {
            const snapshot: LocalStorageSnapshot = {
                users: Array.from(this.users.values()).map(u => ({
                    id: u.getId(),
                    email: u.getEmailValue(),
                    name: u.getName(),
                    image: u.getImage(),
                })),
                accounts: Array.from(this.accounts.values()).map(a => ({
                    id: a.getId(),
                    userId: a.getUserId(),
                    providerId: a.getProviderId(),
                    accountId: a.getAccountId(),
                    password: a.getPassword(),
                    accessToken: a.getAccessToken(),
                    refreshToken: a.getRefreshToken(),
                })),
                sessions: Array.from(this.sessions.values()).map(s => ({
                    id: s.getId(),
                    userId: s.getUserId(),
                    token: s.getToken(),
                    expiresAt: s.getExpiresAt().toISOString(),
                    ipAddress: s.getIpAddress(),
                    userAgent: s.getUserAgent(),
                })),
                owners: Array.from(this.owners.values()),
                veterinarians: Array.from(this.veterinarians.values()),
                clinics: Array.from(this.clinics.values()),
            };

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

            const raw = readFileSync(this.storageFilePath, "utf-8");
            const data: LocalStorageSnapshot = JSON.parse(raw);

            if (Array.isArray(data.users)) {
                data.users.forEach(u => {
                    this.users.set(u.id, UserEntity.create({
                        id: u.id,
                        email: u.email,
                        name: u.name ?? null,
                        image: u.image ?? null,
                    }));
                });
            }

            if (Array.isArray(data.accounts)) {
                data.accounts.forEach(a => {
                    this.accounts.set(a.id, AccountEntity.create({
                        id: a.id,
                        userId: a.userId,
                        providerId: a.providerId,
                        accountId: a.accountId,
                        password: a.password ?? null,
                        accessToken: a.accessToken ?? null,
                        refreshToken: a.refreshToken ?? null,
                    }));
                });
            }

            if (Array.isArray(data.sessions)) {
                data.sessions.forEach(s => {
                    this.sessions.set(s.id, SessionEntity.create({
                        id: s.id,
                        userId: s.userId,
                        token: s.token,
                        expiresAt: new Date(s.expiresAt),
                        ipAddress: s.ipAddress ?? null,
                        userAgent: s.userAgent ?? null,
                    }));
                });
            }

            if (Array.isArray(data.owners)) {
                data.owners.forEach(o => this.owners.set(o.id, o));
            }

            if (Array.isArray(data.veterinarians)) {
                data.veterinarians.forEach(v => this.veterinarians.set(v.id, v));
            }

            if (Array.isArray(data.clinics)) {
                data.clinics.forEach(c => this.clinics.set(c.id, c));
            }
        } catch (error) {
            console.warn("⚠️ [LocalStorageStore] Error al cargar archivo local:", (error as Error).message);
        }
    }

    public clear(): void {
        this.users.clear();
        this.accounts.clear();
        this.sessions.clear();
        this.owners.clear();
        this.veterinarians.clear();
        this.clinics.clear();
        this.initDefaultClinics();
        this.persist();
    }

    // --- Users ---
    public upsertUser(email: string, name?: string, image?: string): UserEntity {
        let existingUser: UserEntity | undefined;
        for (const user of this.users.values()) {
            if (user.getEmailValue().toLowerCase() === email.toLowerCase()) {
                existingUser = user;
                break;
            }
        }

        if (existingUser) {
            const updated = UserEntity.create({
                id: existingUser.getId(),
                email: existingUser.getEmailValue(),
                name: name ?? existingUser.getName(),
                image: image ?? existingUser.getImage(),
            });
            this.users.set(updated.getId(), updated);
            this.persist();
            return updated;
        }

        const newUser = UserEntity.create({
            id: randomUUID(),
            email,
            name: name ?? null,
            image: image ?? null,
        });
        this.users.set(newUser.getId(), newUser);
        this.persist();
        return newUser;
    }

    public findUserById(id: string): UserEntity | null {
        return this.users.get(id) || null;
    }

    public findUserByEmail(email: string): UserEntity | null {
        for (const user of this.users.values()) {
            if (user.getEmailValue().toLowerCase() === email.toLowerCase()) {
                return user;
            }
        }
        return null;
    }

    // --- Accounts ---
    public findAccount(providerId: string, accountId: string, userId: string): AccountEntity | null {
        for (const account of this.accounts.values()) {
            if (
                account.getProviderId() === providerId &&
                account.getAccountId() === accountId &&
                account.getUserId() === userId
            ) {
                return account;
            }
        }
        return null;
    }

    public createAccount(params: {
        userId: string;
        providerId: string;
        accountId: string;
        password?: string | null;
        accessToken?: string | null;
        refreshToken?: string | null;
    }): AccountEntity {
        const account = AccountEntity.create({
            id: randomUUID(),
            userId: params.userId,
            providerId: params.providerId,
            accountId: params.accountId,
            password: params.password ?? null,
            accessToken: params.accessToken ?? null,
            refreshToken: params.refreshToken ?? null,
        });
        this.accounts.set(account.getId(), account);
        this.persist();
        return account;
    }

    public updateAccount(id: string, params: {
        password?: string | null;
        accessToken?: string | null;
        refreshToken?: string | null;
    }): AccountEntity {
        const existing = this.accounts.get(id);
        if (!existing) {
            throw new Error(`Account with id ${id} not found`);
        }

        const updated = AccountEntity.create({
            id: existing.getId(),
            userId: existing.getUserId(),
            providerId: existing.getProviderId(),
            accountId: existing.getAccountId(),
            password: params.password !== undefined ? params.password : existing.getPassword(),
            accessToken: params.accessToken !== undefined ? params.accessToken : existing.getAccessToken(),
            refreshToken: params.refreshToken !== undefined ? params.refreshToken : existing.getRefreshToken(),
        });
        this.accounts.set(id, updated);
        this.persist();
        return updated;
    }

    // --- Sessions ---
    public createSession(params: {
        userId: string;
        token: string;
        expiresAt: Date;
        ipAddress?: string | null;
        userAgent?: string | null;
    }): SessionEntity {
        const session = SessionEntity.create({
            id: randomUUID(),
            userId: params.userId,
            token: params.token,
            expiresAt: params.expiresAt,
            ipAddress: params.ipAddress ?? null,
            userAgent: params.userAgent ?? null,
        });
        this.sessions.set(session.getId(), session);
        this.persist();
        return session;
    }

    public findSessionByToken(token: string): SessionEntity | null {
        for (const session of this.sessions.values()) {
            if (session.getToken() === token) {
                return session;
            }
        }
        return null;
    }

    public updateSessionToken(id: string, newToken: string, expiresAt: Date): SessionEntity {
        const existing = this.sessions.get(id);
        if (!existing) {
            throw new Error(`Session with id ${id} not found`);
        }

        const updated = SessionEntity.create({
            id: existing.getId(),
            userId: existing.getUserId(),
            token: newToken,
            expiresAt,
            ipAddress: existing.getIpAddress(),
            userAgent: existing.getUserAgent(),
        });
        this.sessions.set(id, updated);
        this.persist();
        return updated;
    }

    public deleteSessionByToken(token: string): void {
        for (const [id, session] of this.sessions.entries()) {
            if (session.getToken() === token) {
                this.sessions.delete(id);
            }
        }
        this.persist();
    }

    public deleteSessionsByUserId(userId: string): void {
        for (const [id, session] of this.sessions.entries()) {
            if (session.getUserId() === userId) {
                this.sessions.delete(id);
            }
        }
        this.persist();
    }

    // --- Profiles (Owner & Veterinarian) ---
    public createOwnerProfile(userId: string, data: { phone: string; address: string }): string {
        // Chequear si ya existe un perfil de dueño para este usuario
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

    public findOwnerByUserId(userId: string): StoredOwner | null {
        for (const owner of this.owners.values()) {
            if (owner.userId === userId) return owner;
        }
        return null;
    }

    public findVeterinarianByUserId(userId: string): StoredVeterinarian | null {
        for (const vet of this.veterinarians.values()) {
            if (vet.userId === userId) return vet;
        }
        return null;
    }

    public findUserRoleInfo(userId: string): UserRoleInfo | null {
        const user = this.findUserById(userId);
        if (!user) return null;

        const vet = this.findVeterinarianByUserId(userId);
        if (vet) {
            return {
                id: user.getId(),
                email: user.getEmailValue(),
                name: user.getName(),
                image: user.getImage(),
                role: UserRole.VETERINARIAN,
                ownerId: null,
                veterinarianId: vet.id,
                clinicId: vet.clinicId,
            };
        }

        const owner = this.findOwnerByUserId(userId);
        if (owner) {
            return {
                id: user.getId(),
                email: user.getEmailValue(),
                name: user.getName(),
                image: user.getImage(),
                role: UserRole.OWNER,
                ownerId: owner.id,
                veterinarianId: null,
                clinicId: null,
            };
        }

        return {
            id: user.getId(),
            email: user.getEmailValue(),
            name: user.getName(),
            image: user.getImage(),
            role: UserRole.UNKNOWN,
            ownerId: null,
            veterinarianId: null,
            clinicId: null,
        };
    }

    public getAllClinics(): StoredClinic[] {
        return Array.from(this.clinics.values());
    }
}
