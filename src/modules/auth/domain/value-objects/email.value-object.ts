import { AuthEmailRequiredException, InvalidEmailFormatException } from "@auth/domain/exceptions";

export class Email {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): Email {
        if (!value || value.trim() === "") {
            throw new AuthEmailRequiredException();
        }
        const trimmed = value.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
            throw new InvalidEmailFormatException();
        }
        return new Email(trimmed);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: Email): boolean {
        return this.value === other.getValue();
    }
}
