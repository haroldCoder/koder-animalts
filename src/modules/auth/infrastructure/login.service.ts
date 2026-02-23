import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { randomUUID } from "crypto";
import { AuthenticateParamsDto } from "@auth/infrastructure/dto";
import { ResponseDto } from "@/common/dto/response.dto";

@Injectable()
export class LoginService {
    constructor(private readonly prisma: PrismaService) { }

    async authenticate(params: AuthenticateParamsDto): Promise<ResponseDto<string>> {
        const {
            email,
            name,
            image,
            providerId,
            accountId,
            accessToken,
            refreshToken,
            expiresAt,
            ipAddress,
            userAgent,
        } = params;

        // 1. Upsert User
        const user = await this.prisma.user.upsert({
            where: { email },
            update: {
                name: name ?? undefined,
                image: image ?? undefined,
            },
            create: {
                email,
                name,
                image,
            },
        });

        // 2. Upsert Account
        // Since Account doesn't have a composite unique key in Prisma schema (yet), 
        // we check first or use a find/create logic. 
        // Usually it's @@unique([providerId, accountId]) in NextAuth/BetterAuth patterns.
        // Let's check the schema again for unique constraints on Account.

        let account = await this.prisma.account.findFirst({
            where: {
                providerId,
                accountId,
                userId: user.id
            }
        });

        if (!account) {
            account = await this.prisma.account.create({
                data: {
                    id: randomUUID(),
                    userId: user.id,
                    providerId,
                    accountId,
                    accessToken,
                    refreshToken,
                }
            });
        } else {
            account = await this.prisma.account.update({
                where: { id: account.id },
                data: {
                    accessToken,
                    refreshToken,
                }
            });
        }

        // 3. Create Session
        const sessionToken = randomUUID();
        const sessionExpiresAt = expiresAt ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days default

        const session = await this.prisma.session.create({
            data: {
                id: randomUUID(),
                userId: user.id,
                token: sessionToken,
                expiresAt: sessionExpiresAt,
                ipAddress,
                userAgent,
            }
        });

        return new ResponseDto("Login exitoso", 200, sessionToken);
    }
}
