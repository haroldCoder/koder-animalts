import { UserRole } from "../enums";
import { Email } from "@/common/domain/value-objects";
import { BadRequestException } from "@nestjs/common";

export class UserWithRoleEntity {
    private readonly id: string;
    private readonly email: Email;
    private name: string | null;
    private image: string | null;
    private role: UserRole;

    private constructor(properties: {
        id: string;
        email: Email;
        name?: string | null;
        image?: string | null;
        role: UserRole;
    }) {
        if (!properties.id) {
            throw new BadRequestException("User ID is required");
        }
        if (!properties.email) {
            throw new BadRequestException("User email is required");
        }
        if (!properties.role) {
            throw new BadRequestException("User role is required");
        }

        this.id = properties.id;
        this.email = properties.email;
        this.name = properties.name ?? null;
        this.image = properties.image ?? null;
        this.role = properties.role;
    }

    public static create(properties: {
        id: string;
        email: string;
        name?: string | null;
        image?: string | null;
        role: UserRole;
    }): UserWithRoleEntity {
        const emailVo = Email.create(properties.email);
        return new UserWithRoleEntity({
            id: properties.id,
            email: emailVo,
            name: properties.name,
            image: properties.image,
            role: properties.role,
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

    public getRole(): UserRole {
        return this.role;
    }

    public updateProfile(name?: string | null, image?: string | null): void {
        if (name !== undefined) this.name = name;
        if (image !== undefined) this.image = image;
    }

    public updateRole(role: UserRole): void {
        if (!role) {
            throw new BadRequestException("Role cannot be empty");
        }
        this.role = role;
    }
}
