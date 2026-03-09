import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/db/prisma.service";
import { IOwnerRepository } from "@owner/domain/ports";
import { CreateOwnerModel, OwnerModel } from "@owner/domain/models";
import { OwnerAlreadyExistException } from "@owner/domain/exceptions";
import { AdressNotFoundException, PhoneNotFoundException, UserIdNotFoundException } from "@/common/domain/exceptions";

@Injectable()
export class PrismaOwnerService implements IOwnerRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(owner: CreateOwnerModel): Promise<string> {


        const { address, phone, userId } = owner;
        console.log(!userId);
        if (!address) throw new AdressNotFoundException();
        if (!phone) throw new PhoneNotFoundException();
        if (!userId) throw new UserIdNotFoundException();

        const ownerExist = await this.findByUserId(userId);
        if (ownerExist) throw new OwnerAlreadyExistException();

        const { id } = await this.prisma.owner.create({
            data: owner
        });
        return id;
    }

    async findByUserId(userId: string): Promise<OwnerModel | null> {
        if (!userId) throw new UserIdNotFoundException();

        const owner = await this.prisma.owner.findUnique({
            where: { userId }
        });

        if (!owner) null;

        return owner;
    }
}
