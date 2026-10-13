import { AccountEntity, SessionEntity, UserEntity } from "@auth/domain/entities";
import { CreateAccountParams, CreateSessionParams, UpdateAccountParams, UserRoleInfo } from "./auth.repository.types";

export interface IAuthRepository {
    upsertUser(email: string, name?: string, image?: string): Promise<UserEntity>;
    findUserByEmail(email: string): Promise<UserEntity | null>;
    findAccount(providerId: string, accountId: string, userId: string): Promise<AccountEntity | null>;
    createAccount(data: CreateAccountParams): Promise<AccountEntity>;
    updateAccount(id: string, data: UpdateAccountParams): Promise<AccountEntity>;
    createSession(data: CreateSessionParams): Promise<SessionEntity>;
    findUserRoleInfo(userId: string): Promise<UserRoleInfo | null>;
    findSessionByToken(token: string): Promise<SessionEntity | null>;
    updateSessionToken(id: string, newToken: string, expiresAt: Date): Promise<SessionEntity>;
    deleteSessionByToken(token: string): Promise<void>;
    deleteSessionsByUserId(userId: string): Promise<void>;
    createOwnerProfile(userId: string, data: { phone: string; address: string }): Promise<string>;
    createVeterinarianProfile(userId: string, data: { clinicId: string; phone: string; specialty?: string }): Promise<string>;
}
