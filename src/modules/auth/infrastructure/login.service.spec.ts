import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from '@auth/infrastructure';
import { PrismaService } from '@/common/infrastructure/db/prisma.service';

describe('LoginService', () => {
    let service: LoginService;
    let prisma: PrismaService;

    const mockPrismaService = {
        user: {
            upsert: jest.fn(),
        },
        account: {
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        session: {
            create: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<LoginService>(LoginService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should authenticate and create user, account, and session', async () => {
        const params = {
            email: 'test@example.com',
            name: 'Test User',
            image: 'http://image.com',
            providerId: 'github',
            accountId: '12345',
        };

        const mockUser = { id: 'user-id', ...params };
        const mockAccount = { id: 'account-id', userId: 'user-id', providerId: 'github', accountId: '12345' };
        const mockSession = { id: 'session-id', userId: 'user-id', token: 'token' };

        mockPrismaService.user.upsert.mockResolvedValue(mockUser);
        mockPrismaService.account.findFirst.mockResolvedValue(null);
        mockPrismaService.account.create.mockResolvedValue(mockAccount);
        mockPrismaService.session.create.mockResolvedValue(mockSession);

        const result = await service.authenticate(params);

        expect(prisma.user.upsert).toHaveBeenCalledWith({
            where: { email: params.email },
            update: {
                name: params.name,
                image: params.image,
            },
            create: {
                email: params.email,
                name: params.name,
                image: params.image,
            },
        });

        expect(prisma.account.findFirst).toHaveBeenCalled();
        expect(prisma.account.create).toHaveBeenCalled();
        expect(prisma.session.create).toHaveBeenCalled();

        expect(result).toEqual({
            user: mockUser,
            account: mockAccount,
            session: mockSession,
        });
    });
});
