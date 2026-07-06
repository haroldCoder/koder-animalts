export class SessionEntity {
    private readonly id: string;
    private readonly userId: string;
    private readonly token: string;
    private readonly expiresAt: Date;
    private readonly ipAddress: string | null;
    private readonly userAgent: string | null;

    constructor(properties: {
        id: string;
        userId: string;
        token: string;
        expiresAt: Date;
        ipAddress?: string | null;
        userAgent?: string | null;
    }) {
        if (!properties.id) throw new Error("Session ID is required");
        if (!properties.userId) throw new Error("User ID is required for Session");
        if (!properties.token) throw new Error("Session token is required");
        if (!properties.expiresAt) throw new Error("Expiration date is required for Session");

        this.id = properties.id;
        this.userId = properties.userId;
        this.token = properties.token;
        this.expiresAt = properties.expiresAt;
        this.ipAddress = properties.ipAddress ?? null;
        this.userAgent = properties.userAgent ?? null;
    }

    public static create(properties: {
        id: string;
        userId: string;
        token: string;
        expiresAt: Date;
        ipAddress?: string | null;
        userAgent?: string | null;
    }): SessionEntity {
        return new SessionEntity(properties);
    }

    public getId(): string {
        return this.id;
    }

    public getUserId(): string {
        return this.userId;
    }

    public getToken(): string {
        return this.token;
    }

    public getExpiresAt(): Date {
        return this.expiresAt;
    }

    public getIpAddress(): string | null {
        return this.ipAddress;
    }

    public getUserAgent(): string | null {
        return this.userAgent;
    }

    public isExpired(): boolean {
        return this.expiresAt.getTime() < Date.now();
    }
}
