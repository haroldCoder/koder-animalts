import { Test, TestingModule } from "@nestjs/testing";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { UserRole } from "@user/domain/enums";

describe("JwtAuthGuard", () => {
    let guard: JwtAuthGuard;
    let reflector: Reflector;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtAuthGuard,
                {
                    provide: Reflector,
                    useValue: {
                        getAllAndOverride: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        verifyAsync: jest.fn(),
                    },
                },
            ],
        }).compile();

        guard = module.get<JwtAuthGuard>(JwtAuthGuard);
        reflector = module.get<Reflector>(Reflector);
        jwtService = module.get<JwtService>(JwtService);
    });

    const createMockExecutionContext = (authHeader?: string): ExecutionContext => {
        const request = {
            headers: authHeader ? { authorization: authHeader } : {},
            user: undefined as any,
        };

        return {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: () => ({
                getRequest: () => request,
            }),
        } as unknown as ExecutionContext;
    };

    it("should allow access if route has @Public() decorator", async () => {
        jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(true);

        const context = createMockExecutionContext();
        const result = await guard.canActivate(context);

        expect(result).toBe(true);
    });

    it("should throw UnauthorizedException if no token is provided", async () => {
        jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);

        const context = createMockExecutionContext();

        await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it("should validate valid token and populate request.user with role", async () => {
        jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);
        jest.spyOn(jwtService, "verifyAsync").mockResolvedValue({
            sub: "user-123",
            email: "vet@example.com",
            role: UserRole.VETERINARIAN,
            clinicId: "clinic-1",
            veterinarianId: "vet-1",
        });

        const context = createMockExecutionContext("Bearer valid-jwt-token");
        const result = await guard.canActivate(context);

        expect(result).toBe(true);
        const req = context.switchToHttp().getRequest();
        expect(req.user).toBeDefined();
        expect(req.user.id).toBe("user-123");
        expect(req.user.role).toBe(UserRole.VETERINARIAN);
        expect(req.user.clinicId).toBe("clinic-1");
    });

    it("should throw UnauthorizedException if token verification fails", async () => {
        jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);
        jest.spyOn(jwtService, "verifyAsync").mockRejectedValue(new Error("Invalid token"));

        const context = createMockExecutionContext("Bearer expired-jwt-token");

        await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });
});
