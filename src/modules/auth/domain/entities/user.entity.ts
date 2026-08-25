import { Email } from "@/common/domain/value-objects";

export class UserEntity {
    private readonly id: string;
    private email: Email;
    private name: string | null;
    private image: string | null;

    constructor(properties: {
        id: string;
        email: Email;
        name?: string | null;
        image?: string | null;
    }) {
        if (!properties.id) {
            throw new Error("User ID is required");
        }
        this.id = properties.id;
        this.email = properties.email;
        this.name = properties.name ?? null;
        this.image = properties.image ?? null;
    }

    public static create(properties: {
        id: string;
        email: string;
        name?: string | null;
        image?: string | null;
    }): UserEntity {
        const emailVo = Email.create(properties.email);
        return new UserEntity({
            id: properties.id,
            email: emailVo,
            name: properties.name,
            image: properties.image,
        });
    }

    public getId(): string {
        return this.id;
    }

    public getEmail(): Email {
        return this.email;
    }

    public getEmailValue(): string {
        return this.email.getValue();
    }

    public getName(): string | null {
        return this.name;
    }

    public getImage(): string | null {
        return this.image;
    }

    public updateProfile(name?: string | null, image?: string | null): void {
        if (name !== undefined) this.name = name;
        if (image !== undefined) this.image = image;
    }
}
