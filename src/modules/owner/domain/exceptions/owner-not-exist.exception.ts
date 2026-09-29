import { NotFoundException } from "@nestjs/common";

export class OwnerNotFoundException extends NotFoundException {
    constructor(userId?: string) {
        super(userId ? `Owner not found for the given user id: ${userId}` : "Owner not found");
    }
}