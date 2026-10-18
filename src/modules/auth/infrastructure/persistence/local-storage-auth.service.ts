import { Injectable } from "@nestjs/common";
import { IAuthRepository } from "@auth/domain/ports";
import {
    CreateAccountParams,
    CreateSessionParams,
    UpdateAccountParams,
    UserRoleInfo,
} from "@auth/domain/ports/auth.repository.types";
import { AccountEntity, SessionEntity, UserEntity } from "@auth/domain/entities";
import { getSessionExpirationDate } from "@/common/domain/constants";
import { LocalStorageStore } from "./local-storage.store";

@Injectable()
export class LocalStorageAuthService implements IAuthRepository {
    private readonly store: LocalStorageStore;

    constructor() {
        this.store = LocalStorageStore.getInstance();
    }

    async upsertUser(email: string, name?: string, image?: string): Promise<UserEntity> {
        return this.store.upsertUser(email, name, image);
    }

    async findUserByEmail(email: string): Promise<UserEntity | null> {
        return this.store.findUserByEmail(email);
    }

    async findAccount(providerId: string, accountId: string, userId: string): Promise<AccountEntity | null> {
        return this.store.findAccount(providerId, accountId, userId);
    }

    async createAccount(data: CreateAccountParams): Promise<AccountEntity> {
        return this.store.createAccount({
            userId: data.userId,
            providerId: data.providerId,
            accountId: data.accountId,
            password: data.password,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        });
    }

    async updateAccount(id: string, data: UpdateAccountParams): Promise<AccountEntity> {
        return this.store.updateAccount(id, {
            password: data.password,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        });
    }

    async createSession(data: CreateSessionParams): Promise<SessionEntity> {
        const expiresAt = data.expiresAt ?? getSessionExpirationDate();
        return this.store.createSession({
            userId: data.userId,
            token: data.token,
            expiresAt,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
        });
    }

    async findUserRoleInfo(userId: string): Promise<UserRoleInfo | null> {
        return this.store.findUserRoleInfo(userId);
    }

    async findSessionByToken(token: string): Promise<SessionEntity | null> {
        return this.store.findSessionByToken(token);
    }

    async updateSessionToken(id: string, newToken: string, expiresAt?: Date): Promise<SessionEntity> {
        const updatedExpiresAt = expiresAt ?? getSessionExpirationDate();
        return this.store.updateSessionToken(id, newToken, updatedExpiresAt);
    }

    async deleteSessionByToken(token: string): Promise<void> {
        this.store.deleteSessionByToken(token);
    }

    async deleteSessionsByUserId(userId: string): Promise<void> {
        this.store.deleteSessionsByUserId(userId);
    }

    async createOwnerProfile(userId: string, data: { phone: string; address: string }): Promise<string> {
        return this.store.createOwnerProfile(userId, data);
    }

    async createVeterinarianProfile(userId: string, data: {
        clinicId: string;
        phone: string;
        specialty?: string;
    }): Promise<string> {
        return this.store.createVeterinarianProfile(userId, data);
    }

    public getStore(): LocalStorageStore {
        return this.store;
    }
}
