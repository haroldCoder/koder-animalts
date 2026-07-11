import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { IOwnerRepository } from "@owner/domain/ports";
import { OwnerEntity } from "@owner/domain/entities";
import { OwnerAlreadyExistException } from "@owner/domain/exceptions";

@Injectable()
export class PrismaOwnerService implements IOwnerRepository {
    constructor(private readonly prisma: PrismaService) { }

    private mapToDomain(owner: {
        id: string;
        address: string;
        phone: string;
        userId: string;
        createdAt?: Date;
        updatedAt?: Date;
    }): OwnerEntity {
        return OwnerEntity.create({
            id: owner.id,
            address: owner.address,
            phone: owner.phone,
            userId: owner.userId,
            createdAt: owner.createdAt,
            updatedAt: owner.updatedAt,
        });
    }

    async create(owner: OwnerEntity): Promise<string> {
        const existing = await this.prisma.owner.findUnique({
            where: { userId: owner.getUserId() }
        });

        if (existing) throw new OwnerAlreadyExistException();

        const { id } = await this.prisma.owner.create({
            data: {
                id: owner.getId(),
                address: owner.getAddress(),
                phone: owner.getPhone(),
                userId: owner.getUserId(),
            }
        });

        return id;
    }

    async findByUserId(userId: string): Promise<OwnerEntity | null> {
        const owner = await this.prisma.owner.findUnique({
            where: { userId }
        });

        if (!owner) return null;

        return this.mapToDomain(owner);
    }
}
