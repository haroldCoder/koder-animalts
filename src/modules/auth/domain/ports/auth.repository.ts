import { AccountEntity, SessionEntity, UserEntity } from "@auth/domain/entities";
import { CreateAccountParams, CreateSessionParams, UpdateAccountParams } from "./auth.repository.types";

export interface IAuthRepository {
    upsertUser(email: string, name?: string, image?: string): Promise<UserEntity>;
    findUserByEmail(email: string): Promise<UserEntity | null>;
    findAccount(providerId: string, accountId: string, userId: string): Promise<AccountEntity | null>;
    createAccount(data: CreateAccountParams): Promise<AccountEntity>;
    updateAccount(id: string, data: UpdateAccountParams): Promise<AccountEntity>;
    createSession(data: CreateSessionParams): Promise<SessionEntity>;
}

