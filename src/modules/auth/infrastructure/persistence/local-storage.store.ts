import { randomUUID } from "crypto";
import { AccountEntity, SessionEntity, UserEntity } from "@auth/domain/entities";
import { UserRole } from "@user/domain/enums";
import { UserRoleInfo } from "@auth/domain/ports/auth.repository.types";
import { hashPassword } from "@auth/infrastructure/utils/hash.utils";
import {
    LocalStorageStore as CommonLocalStorageStore,
    StoredClinic,
    StoredOwner,
    StoredVeterinarian,
} from "@/common/infrastructure/persistence";

export { StoredClinic, StoredOwner, StoredVeterinarian } from "@/common/infrastructure/persistence";
export { StoredPet, StoredPetBackground } from "@pet/infrastructure/persistence/local-pet.store";

export interface StoredUserSnapshot {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
}

export interface StoredAccountSnapshot {
    id: string;
    userId: string;
    providerId: string;
    accountId: string;
    password?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
}

export interface StoredSessionSnapshot {
    id: string;
    userId: string;
    token: string;
    expiresAt: string;
    ipAddress?: string | null;
    userAgent?: string | null;
}

export class LocalStorageStore {
    private static instance: LocalStorageStore;

    private readonly commonStore: CommonLocalStorageStore;
    private users = new Map<string, UserEntity>();
    private accounts = new Map<string, AccountEntity>();
    private sessions = new Map<string, SessionEntity>();

    private constructor() {
        this.commonStore = CommonLocalStorageStore.getInstance();
        this.loadFromFile();
        if (this.users.size === 0) {
            this.initDefaultSeedData();
            this.persist();
        }
    }

    public static getInstance(): LocalStorageStore {
        if (!LocalStorageStore.instance) {
            LocalStorageStore.instance = new LocalStorageStore();
        }
        return LocalStorageStore.instance;
    }

    private initDefaultSeedData(): void {
        const defaultPasswordHash = hashPassword("Password123!");

        // Veterinario por defecto
        const vetUserId = "99999999-9999-4999-a999-999999999999";
        this.users.set(vetUserId, UserEntity.create({
            id: vetUserId,
            email: "vet@koder.com",
            name: "Dra. Gomez",
            image: null,
        }));
        this.users.set("user-vet-001", UserEntity.create({
            id: "user-vet-001",
            email: "vet@koder.com",
            name: "Dra. Gomez",
            image: null,
        }));

        this.accounts.set(`acc-${vetUserId}`, AccountEntity.create({
            id: `acc-${vetUserId}`,
            userId: vetUserId,
            providerId: "credentials",
            accountId: "vet@koder.com",
            password: defaultPasswordHash,
            accessToken: null,
            refreshToken: null,
        }));
        this.accounts.set("acc-user-vet-001", AccountEntity.create({
            id: "acc-user-vet-001",
            userId: "user-vet-001",
            providerId: "credentials",
            accountId: "vet@koder.com",
            password: defaultPasswordHash,
            accessToken: null,
            refreshToken: null,
        }));

        // Dueño por defecto
        const ownerUserId = "77777777-7777-4777-a777-777777777777";
        this.users.set(ownerUserId, UserEntity.create({
            id: ownerUserId,
            email: "owner@koder.com",
            name: "Carlos Dueño",
            image: null,
        }));
        this.users.set("user-owner-001", UserEntity.create({
            id: "user-owner-001",
            email: "owner@koder.com",
            name: "Carlos Dueño",
            image: null,
        }));

        this.accounts.set(`acc-${ownerUserId}`, AccountEntity.create({
            id: `acc-${ownerUserId}`,
            userId: ownerUserId,
            providerId: "credentials",
            accountId: "owner@koder.com",
            password: defaultPasswordHash,
            accessToken: null,
            refreshToken: null,
        }));
        this.accounts.set("acc-user-owner-001", AccountEntity.create({
            id: "acc-user-owner-001",
            userId: "user-owner-001",
            providerId: "credentials",
            accountId: "owner@koder.com",
            password: defaultPasswordHash,
            accessToken: null,
            refreshToken: null,
        }));
    }

    public persist(): void {
        const usersSnapshot: StoredUserSnapshot[] = Array.from(this.users.values()).map(u => ({
            id: u.getId(),
            email: u.getEmailValue(),
            name: u.getName(),
            image: u.getImage(),
        }));

        const accountsSnapshot: StoredAccountSnapshot[] = Array.from(this.accounts.values()).map(a => ({
            id: a.getId(),
            userId: a.getUserId(),
            providerId: a.getProviderId(),
            accountId: a.getAccountId(),
            password: a.getPassword(),
            accessToken: a.getAccessToken(),
            refreshToken: a.getRefreshToken(),
        }));

        const sessionsSnapshot: StoredSessionSnapshot[] = Array.from(this.sessions.values()).map(s => ({
            id: s.getId(),
            userId: s.getUserId(),
            token: s.getToken(),
            expiresAt: s.getExpiresAt().toISOString(),
            ipAddress: s.getIpAddress(),
            userAgent: s.getUserAgent(),
        }));

        this.commonStore.setSlice("users", usersSnapshot);
        this.commonStore.setSlice("accounts", accountsSnapshot);
        this.commonStore.setSlice("sessions", sessionsSnapshot);
    }

    public loadFromFile(): void {
        const users = this.commonStore.getSlice<StoredUserSnapshot>("users");
        users.forEach(u => {
            this.users.set(u.id, UserEntity.create({
                id: u.id,
                email: u.email,
                name: u.name ?? null,
                image: u.image ?? null,
            }));
        });

        const accounts = this.commonStore.getSlice<StoredAccountSnapshot>("accounts");
        accounts.forEach(a => {
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

        const sessions = this.commonStore.getSlice<StoredSessionSnapshot>("sessions");
        sessions.forEach(s => {
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

    public clear(): void {
        this.users.clear();
        this.accounts.clear();
        this.sessions.clear();
        this.initDefaultSeedData();
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

    // --- Role & Profile Delegations ---
    public findUserRoleInfo(userId: string): UserRoleInfo | null {
        const user = this.findUserById(userId);
        if (!user) return null;

        const vet = this.commonStore.findVeterinarianByUserId(userId);
        if (vet) {
            return {
                id: user.getId(),
                userId: user.getId(),
                email: user.getEmailValue(),
                name: user.getName(),
                image: user.getImage(),
                role: UserRole.VETERINARIAN,
                ownerId: null,
                veterinarianId: vet.id,
                clinicId: vet.clinicId,
            };
        }

        const owner = this.commonStore.findOwnerByUserId(userId);
        if (owner) {
            return {
                id: user.getId(),
                userId: user.getId(),
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
            userId: user.getId(),
            email: user.getEmailValue(),
            name: user.getName(),
            image: user.getImage(),
            role: UserRole.UNKNOWN,
            ownerId: null,
            veterinarianId: null,
            clinicId: null,
        };
    }

    public createOwnerProfile(userId: string, data: { phone: string; address: string }): string {
        return this.commonStore.createOwnerProfile(userId, data);
    }

    public createVeterinarianProfile(userId: string, data: {
        clinicId: string;
        phone: string;
        specialty?: string | null;
    }): string {
        return this.commonStore.createVeterinarianProfile(userId, data);
    }

    public findOwnerByUserId(userId: string): StoredOwner | null {
        return this.commonStore.findOwnerByUserId(userId);
    }

    public findVeterinarianByUserId(userId: string): StoredVeterinarian | null {
        return this.commonStore.findVeterinarianByUserId(userId);
    }

    public getAllClinics(): StoredClinic[] {
        return this.commonStore.getAllClinics();
    }

    public findClinicById(id: string): StoredClinic | null {
        return this.commonStore.findClinicById(id);
    }

    public findOwnerById(id: string): StoredOwner | null {
        return this.commonStore.findOwnerById(id);
    }

    public findVeterinarianById(id: string): StoredVeterinarian | null {
        return this.commonStore.findVeterinarianById(id);
    }
}
