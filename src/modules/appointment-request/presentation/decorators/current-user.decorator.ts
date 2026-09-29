import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface CurrentUserPayload {
    id: string;
    email?: string;
    role?: string;
    clinicId?: string;
    [key: string]: any;
}

export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        return data ? user?.[data] : user;
    },
);
