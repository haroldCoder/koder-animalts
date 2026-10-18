import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            console.log("db connected");
        } catch (error) {
            if (process.env.AUTH_REPO === "local" || process.env.NODE_ENV === "test") {
                console.warn("⚠️ [PrismaService] Conexión a BD no disponible en modo TEST/LOCAL (continuando con repositorios locales):", (error as Error).message);
            } else {
                throw error;
            }
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log("db disconnected");
    }
}