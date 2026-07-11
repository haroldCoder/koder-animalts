import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { IUserRepository, UserMetadata } from "@user/domain/ports";
import { UserRole, UserWithRoleEntity } from "@user/domain/entities";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(userId: string): Promise<UserMetadata | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                owner: true,
                veterinarian: { select: { id: true } },
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

        const userWithRoleEntity = UserWithRoleEntity.create({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role,
        });

        return {
            user: userWithRoleEntity,
            userType: "user",
        };
    }
}
