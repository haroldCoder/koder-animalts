import { AuthAccountIdRequiredException, AuthProviderIdRequiredException } from "@auth/domain/exceptions";

export class AccountEntity {
    private readonly id: string;
    private readonly userId: string;
    private readonly providerId: string;
    private readonly accountId: string;
    private accessToken: string | null;
    private refreshToken: string | null;
    private password: string | null;

    constructor(properties: {
        id: string;
        userId: string;
        providerId: string;
        accountId: string;
        accessToken?: string | null;
        refreshToken?: string | null;
        password?: string | null;
    }) {
        if (!properties.id) throw new Error("Account ID is required");
        if (!properties.userId) throw new Error("User ID is required for Account");
        if (!properties.providerId) throw new AuthProviderIdRequiredException();
        if (!properties.accountId) throw new AuthAccountIdRequiredException();

        this.id = properties.id;
        this.userId = properties.userId;
        this.providerId = properties.providerId;
        this.accountId = properties.accountId;
        this.accessToken = properties.accessToken ?? null;
        this.refreshToken = properties.refreshToken ?? null;
        this.password = properties.password ?? null;
    }

    public static create(properties: {
        id: string;
        userId: string;
        providerId: string;
        accountId: string;
        accessToken?: string | null;
        refreshToken?: string | null;
        password?: string | null;
    }): AccountEntity {
        return new AccountEntity(properties);
    }

    public getId(): string {
        return this.id;
    }

    public getUserId(): string {
        return this.userId;
    }

    public getProviderId(): string {
        return this.providerId;
    }

    public getAccountId(): string {
        return this.accountId;
    }

    public getAccessToken(): string | null {
        return this.accessToken;
    }

    public getRefreshToken(): string | null {
        return this.refreshToken;
    }

    public getPassword(): string | null {
        return this.password;
    }

    public updateTokens(accessToken?: string | null, refreshToken?: string | null): void {
        if (accessToken !== undefined) this.accessToken = accessToken;
        if (refreshToken !== undefined) this.refreshToken = refreshToken;
    }

    public updatePassword(password: string): void {
        this.password = password;
    }
}
