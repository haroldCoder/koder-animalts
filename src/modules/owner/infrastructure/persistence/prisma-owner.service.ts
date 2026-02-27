import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { IOwnerRepository } from "@owner/domain/ports";
import { CreateOwnerModel, OwnerModel } from "@owner/domain/models";
import { OwnerAlreadyExistException } from "@owner/domain/exceptions";

@Injectable()
export class PrismaOwnerService implements IOwnerRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(owner: CreateOwnerModel): Promise<string> {
        const ownerExist = await this.findByUserId(owner.userId);
        if (ownerExist) throw new OwnerAlreadyExistException();

        const { id } = await this.prisma.owner.create({
            data: owner
        });
        return id;
    }

    async findByUserId(userId: string): Promise<OwnerModel | null> {
        return this.prisma.owner.findUnique({
            where: { userId }
        });
    }
}
