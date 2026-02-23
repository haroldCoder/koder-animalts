import { PrismaService } from "@/common/infrastructure/db";
import { Injectable } from "@nestjs/common";
import { CreateOwnerDto } from "@owner/infrastructure/dto";
import { AdressNotFoundException } from "@owner/domain/exceptions";
import { ResponseDto } from "@/common/dto/response.dto";
import { PhoneNotFoundException, UserIdNotFoundException } from "@/common/domain/exceptions";


@Injectable()
export class OwnerService {
    constructor(private readonly prisma: PrismaService) { }

    async createOwner(owner: CreateOwnerDto): Promise<ResponseDto<string>> {
        const { address, phone, userId } = owner;

        if (!address) throw new AdressNotFoundException();
        if (!phone) throw new PhoneNotFoundException();
        if (!userId) throw new UserIdNotFoundException();

        const ownerCreated = await this.prisma.owner.create({ data: owner });

        return {
            message: "Owner created successfully",
            statusCode: 201,
            data: ownerCreated.id,
        };
    }
}