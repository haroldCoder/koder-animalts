import { Inject, Injectable } from "@nestjs/common";
import type { IOwnerRepository } from "@owner/domain/ports";
import { CreateOwnerModel } from "@owner/domain/models";
import { ResponseDto } from "@/common/domain/dto";
import { AdressNotFoundException, PhoneNotFoundException, ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { OwnerAlreadyExistException } from "@owner/domain/exceptions";

@Injectable()
export class CreateOwnerUseCase {
    constructor(
        @Inject("IOwnerRepository")
        private readonly ownerRepository: IOwnerRepository
    ) { }

    async execute(params: CreateOwnerModel): Promise<ResponseDto<string>> {
        try {
            const ownerCreated = await this.ownerRepository.create(params);

            return {
                message: "Owner created successfully",
                statusCode: 201,
                data: ownerCreated,
            };
        }
        catch (err) {
            if (
                err instanceof AdressNotFoundException ||
                err instanceof PhoneNotFoundException ||
                err instanceof UserIdNotFoundException ||
                err instanceof OwnerAlreadyExistException
            ) {
                throw err;
            }

            throw new ServerErrorException("create owner failed" + err);
        }
    }
}
