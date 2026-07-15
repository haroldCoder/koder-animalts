import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { IOwnerRepository } from "@owner/domain/ports";
import { OwnerEntity } from "@owner/domain/entities";
import { ResponseDto } from "@/common/domain/dto";
import { AdressNotFoundException, PhoneNotFoundException, ServerErrorException, UserIdNotFoundException } from "@/common/domain/exceptions";
import { OwnerAlreadyExistException } from "@owner/domain/exceptions";
import type { CreateOwnerParams } from "../types";

@Injectable()
export class CreateOwnerUseCase {
    constructor(
        @Inject("IOwnerRepository")
        private readonly ownerRepository: IOwnerRepository,
        @Inject("IIdGenerator")
        private readonly generateId: () => string,
    ) { }

    async execute(params: CreateOwnerParams): Promise<ResponseDto<string>> {
        try {
            this.ensureUserIdPresent(params.userId);

            const existing = await this.ownerRepository.findByUserId(params.userId);

            // Domain rule: an owner can only be created once per userId
            OwnerEntity.ensureDoesNotExist(existing);

            // Domain validation rules run inside OwnerEntity.create
            const owner = this.buildOwnerEntity(params);

            const ownerId = await this.ownerRepository.create(owner);

            return {
                message: "Owner created successfully",
                statusCode: HttpStatus.CREATED,
                data: ownerId,
            };
        } catch (error) {
            if (
                error instanceof AdressNotFoundException ||
                error instanceof PhoneNotFoundException ||
                error instanceof UserIdNotFoundException ||
                error instanceof OwnerAlreadyExistException
            ) {
                throw error;
            }
            throw new ServerErrorException("Failed to create owner: " + error);
        }
    }

    private ensureUserIdPresent(userId: string): void {
        if (!userId) throw new UserIdNotFoundException();
    }

    private buildOwnerEntity(params: CreateOwnerParams): OwnerEntity {
        return OwnerEntity.create({
            id: this.generateId(),
            address: params.address,
            phone: params.phone,
            userId: params.userId,
        });
    }
}
