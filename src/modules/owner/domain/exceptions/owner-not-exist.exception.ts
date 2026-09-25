export class OwnerNotFoundException extends Error {
    constructor(userId: string) {
        super(`Owner not found for the given user id: ${userId}`);
    }
}