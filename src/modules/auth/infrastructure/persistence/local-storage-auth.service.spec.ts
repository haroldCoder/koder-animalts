import { LocalStorageAuthService } from "./local-storage-auth.service";
import { UserRole } from "@user/domain/enums";

describe("LocalStorageAuthService", () => {
    let service: LocalStorageAuthService;

    beforeEach(() => {
        service = new LocalStorageAuthService();
        service.getStore().clear();
    });

    afterAll(() => {
        service.getStore().clear();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should upsert and find user by email", async () => {
        const user = await service.upsertUser("test@koder.com", "Juan Perez", "https://img.com/avatar.png");
        expect(user).toBeDefined();
        expect(user.getId()).toBeDefined();
        expect(user.getEmailValue()).toBe("test@koder.com");
        expect(user.getName()).toBe("Juan Perez");

        const found = await service.findUserByEmail("test@koder.com");
        expect(found).toBeDefined();
        expect(found?.getId()).toBe(user.getId());
    });

    it("should create and find account", async () => {
        const user = await service.upsertUser("test@koder.com", "Juan");
        const account = await service.createAccount({
            userId: user.getId(),
            providerId: "credentials",
            accountId: "test@koder.com",
            password: "hashed_password",
        });

        expect(account).toBeDefined();
        expect(account.getUserId()).toBe(user.getId());

        const foundAccount = await service.findAccount("credentials", "test@koder.com", user.getId());
        expect(foundAccount).toBeDefined();
        expect(foundAccount?.getPassword()).toBe("hashed_password");
    });

    it("should create and manage sessions", async () => {
        const user = await service.upsertUser("session@koder.com");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

        const session = await service.createSession({
            userId: user.getId(),
            token: "token-123",
            expiresAt,
            ipAddress: "127.0.0.1",
        });

        expect(session.getToken()).toBe("token-123");

        const found = await service.findSessionByToken("token-123");
        expect(found).toBeDefined();
        expect(found?.getUserId()).toBe(user.getId());

        await service.deleteSessionByToken("token-123");
        const afterDelete = await service.findSessionByToken("token-123");
        expect(afterDelete).toBeNull();
    });

    it("should create owner profile and update user role info", async () => {
        const user = await service.upsertUser("owner@koder.com", "Dueño Test");
        const initialRoleInfo = await service.findUserRoleInfo(user.getId());
        expect(initialRoleInfo?.role).toBe(UserRole.UNKNOWN);

        const ownerId = await service.createOwnerProfile(user.getId(), {
            phone: "+573001234567",
            address: "Calle 123 # 45-67",
        });

        expect(ownerId).toBeDefined();

        const updatedRoleInfo = await service.findUserRoleInfo(user.getId());
        expect(updatedRoleInfo?.role).toBe(UserRole.OWNER);
        expect(updatedRoleInfo?.ownerId).toBe(ownerId);
        expect(updatedRoleInfo?.veterinarianId).toBeNull();
    });

    it("should create veterinarian profile and update user role info", async () => {
        const user = await service.upsertUser("vet@koder.com", "Dra. Gomez");

        const vetId = await service.createVeterinarianProfile(user.getId(), {
            clinicId: "clinic-001",
            phone: "+573109876543",
            specialty: "Cirugía",
        });

        expect(vetId).toBeDefined();

        const roleInfo = await service.findUserRoleInfo(user.getId());
        expect(roleInfo?.role).toBe(UserRole.VETERINARIAN);
        expect(roleInfo?.veterinarianId).toBe(vetId);
        expect(roleInfo?.clinicId).toBe("clinic-001");
    });
});
