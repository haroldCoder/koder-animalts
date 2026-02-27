import { AccountModel, SessionModel, UserModel } from "@auth/domain/models";

export interface IAuthRepository {
    upsertUser(email: string, name?: string, image?: string): Promise<UserModel>;
    findAccount(providerId: string, accountId: string, userId: string): Promise<AccountModel | null>;
    createAccount(data: Omit<AccountModel, 'id'>): Promise<AccountModel>;
    updateAccount(id: string, data: Partial<AccountModel>): Promise<AccountModel>;
    createSession(data: Omit<SessionModel, 'id'>): Promise<SessionModel>;
}
