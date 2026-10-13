import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserRole } from "@user/domain/enums";

export interface CurrentUserPayload {
    id: string;
    userId: string;
    email: string;
    role: UserRole | string;
    clinicId?: string | null;
    ownerId?: string | null;
    veterinarianId?: string | null;
    [key: string]: any;
}

export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        return data ? user?.[data] : user;
    },
);
