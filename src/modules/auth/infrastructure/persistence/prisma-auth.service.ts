import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { IAuthRepository } from "@auth/domain/ports";
import { AccountModel, SessionModel, UserModel } from "@auth/domain/models";
import { randomUUID } from "crypto";

@Injectable()
export class PrismaAuthService implements IAuthRepository {
    constructor(private readonly prisma: PrismaService) { }

    async upsertUser(email: string, name?: string, image?: string): Promise<UserModel> {
        return this.prisma.user.upsert({
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
    }

    async findAccount(providerId: string, accountId: string, userId: string): Promise<AccountModel | null> {
        return this.prisma.account.findFirst({
            where: {
                providerId,
                accountId,
                userId
            }
        });
    }

    async createAccount(data: Omit<AccountModel, 'id'>): Promise<AccountModel> {
        return this.prisma.account.create({
            data: {
                id: randomUUID(),
                ...data
            }
        });
    }

    async updateAccount(id: string, data: Partial<AccountModel>): Promise<AccountModel> {
        return this.prisma.account.update({
            where: { id },
            data
        });
    }

    async createSession(data: Omit<SessionModel, 'id'>): Promise<SessionModel> {
        return this.prisma.session.create({
            data: {
                id: randomUUID(),
                ...data
            }
        });
    }
}
