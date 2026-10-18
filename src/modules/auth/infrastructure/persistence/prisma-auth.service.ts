import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { IAuthRepository } from "@auth/domain/ports";
import { CreateAccountParams, CreateSessionParams, UpdateAccountParams, UserRoleInfo } from "@auth/domain/ports/auth.repository.types";
import { AccountEntity, SessionEntity, UserEntity } from "@auth/domain/entities";
import { UserRole } from "@user/domain/enums";
import { randomUUID } from "crypto";
import { getSessionExpirationDate } from "@/common/domain/constants";

@Injectable()
export class PrismaAuthService implements IAuthRepository {
    constructor(private readonly prisma: PrismaService) { }

    async upsertUser(email: string, name?: string, image?: string): Promise<UserEntity> {
        const user = await this.prisma.user.upsert({
            where: { email },
            update: {
                name: name ?? null,
                image: image ?? null,
            },
            create: {
                email,
                name: name ?? null,
                image: image ?? null,
            },
        });

        return UserEntity.create({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image
        });
    }

    async findUserByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) return null;

        return UserEntity.create({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image
        });
    }

    async findAccount(providerId: string, accountId: string, userId: string): Promise<AccountEntity | null> {
        const account = await this.prisma.account.findFirst({
            where: {
                providerId,
                accountId,
                userId
            }
        });

        if (!account) return null;

        return AccountEntity.create({
            id: account.id,
            userId: account.userId,
            providerId: account.providerId,
            accountId: account.accountId,
            accessToken: account.accessToken,
            refreshToken: account.refreshToken,
            password: account.password,
        });
    }

    async createAccount(data: CreateAccountParams): Promise<AccountEntity> {
        const account = await this.prisma.account.create({
            data: {
                id: randomUUID(),
                userId: data.userId,
                providerId: data.providerId,
                accountId: data.accountId,
                accessToken: data.accessToken ?? null,
                refreshToken: data.refreshToken ?? null,
                password: data.password ?? null,
            }
        });

        return AccountEntity.create({
            id: account.id,
            userId: account.userId,
            providerId: account.providerId,
            accountId: account.accountId,
            accessToken: account.accessToken,
            refreshToken: account.refreshToken,
            password: account.password,
        });
    }

    async updateAccount(id: string, data: UpdateAccountParams): Promise<AccountEntity> {
        const account = await this.prisma.account.update({
            where: { id },
            data: {
                accessToken: data.accessToken !== undefined ? data.accessToken : undefined,
                refreshToken: data.refreshToken !== undefined ? data.refreshToken : undefined,
                password: data.password !== undefined ? data.password : undefined,
            }
        });

        return AccountEntity.create({
            id: account.id,
            userId: account.userId,
            providerId: account.providerId,
            accountId: account.accountId,
            accessToken: account.accessToken,
            refreshToken: account.refreshToken,
            password: account.password,
        });
    }

    async createSession(data: CreateSessionParams): Promise<SessionEntity> {
        const expiresAt = data.expiresAt ?? getSessionExpirationDate();

        const session = await this.prisma.session.create({
            data: {
                id: randomUUID(),
                userId: data.userId,
                token: data.token,
                expiresAt,
                ipAddress: data.ipAddress ?? null,
                userAgent: data.userAgent ?? null,
            }
        });

        return SessionEntity.create({
            id: session.id,
            userId: session.userId,
            token: session.token,
            expiresAt: session.expiresAt,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
        });
    }

    async findUserRoleInfo(userId: string): Promise<UserRoleInfo | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                owner: true,
                veterinarian: true,
            },
        });

        if (!user) return null;

        let role = UserRole.UNKNOWN;
        let ownerId: string | null = null;
        let veterinarianId: string | null = null;
        let clinicId: string | null = null;

        if (user.veterinarian) {
            role = UserRole.VETERINARIAN;
            veterinarianId = user.veterinarian.id;
            clinicId = user.veterinarian.clinicId;
        } else if (user.owner) {
            role = UserRole.OWNER;
            ownerId = user.owner.id;
        }

        return {
            id: user.id,
            userId: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role,
            ownerId,
            veterinarianId,
            clinicId,
        };
    }

    async findSessionByToken(token: string): Promise<SessionEntity | null> {
        const session = await this.prisma.session.findUnique({
            where: { token },
        });

        if (!session) return null;

        return SessionEntity.create({
            id: session.id,
            userId: session.userId,
            token: session.token,
            expiresAt: session.expiresAt,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
        });
    }

    async updateSessionToken(id: string, newToken: string, expiresAt?: Date): Promise<SessionEntity> {
        const updatedExpiresAt = expiresAt ?? getSessionExpirationDate();

        const session = await this.prisma.session.update({
            where: { id },
            data: {
                token: newToken,
                expiresAt: updatedExpiresAt,
            },
        });

        return SessionEntity.create({
            id: session.id,
            userId: session.userId,
            token: session.token,
            expiresAt: session.expiresAt,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
        });
    }

    async deleteSessionByToken(token: string): Promise<void> {
        await this.prisma.session.deleteMany({
            where: { token },
        });
    }

    async deleteSessionsByUserId(userId: string): Promise<void> {
        await this.prisma.session.deleteMany({
            where: { userId },
        });
    }

    async createOwnerProfile(userId: string, data: { phone: string; address: string }): Promise<string> {
        const owner = await this.prisma.owner.create({
            data: {
                id: randomUUID(),
                userId,
                phone: data.phone,
                address: data.address,
            },
        });
        return owner.id;
    }

    async createVeterinarianProfile(userId: string, data: { clinicId: string; phone: string; specialty?: string }): Promise<string> {
        const vet = await this.prisma.veterinarian.create({
            data: {
                id: randomUUID(),
                userId,
                clinicId: data.clinicId,
                phone: data.phone,
                specialty: data.specialty ?? null,
            },
        });
        return vet.id;
    }
}
