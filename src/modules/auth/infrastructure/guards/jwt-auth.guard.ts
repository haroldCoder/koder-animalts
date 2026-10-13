import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "@/common/presentation/decorators";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException("No provided bearer token authorization");
        }

        try {
            const secret = process.env.JWT_SECRET || "koder-animalts-jwt-secret-key-2026";
            const payload = await this.jwtService.verifyAsync(token, { secret });

            request.user = {
                id: payload.sub,
                userId: payload.sub,
                email: payload.email,
                role: payload.role,
                clinicId: payload.clinicId,
                ownerId: payload.ownerId,
                veterinarianId: payload.veterinarianId,
                ...payload,
            };
        } catch {
            throw new UnauthorizedException("Token access invalid or expired");
        }

        return true;
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const authHeader = request?.headers?.authorization || request?.headers?.Authorization;
        if (!authHeader) {
            return undefined;
        }
        const [type, token] = authHeader.split(" ");
        return type === "Bearer" ? token : undefined;
    }
}
