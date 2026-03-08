import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { IUserRepository } from "@user/domain/ports";
import { UserRole, UserWithRoleModel } from "@user/domain/models";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(userId: string): Promise<UserWithRoleModel | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                owner: true,
                veterinarian: true,
            },
        });

        if (!user) {
            return null;
        }

        let role = UserRole.UNKNOWN;
        if (user.veterinarian) {
            role = UserRole.VETERINARIAN;
        } else if (user.owner) {
            role = UserRole.OWNER;
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role,
        };
    }
}
