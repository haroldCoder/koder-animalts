import { Test, TestingModule } from "@nestjs/testing";
import { UpdateClinicUseCase } from "./update-clinic.use-case";
import { IPetRepository } from "@pet/domain/ports";
import { IAppointmentRepository } from "@appointment/domain/ports/appointment.repository";
import { ClinicChangeNotAllowedByAppointmentException } from "@/common/domain/exceptions";
import { AppointmentEntity } from "@appointment/domain/entities";
import { AppointmentStatus } from "@appointment/domain/enums/appointment-status.enum";

describe("UpdateClinicUseCase", () => {
    let useCase: UpdateClinicUseCase;
    let petRepository: jest.Mocked<IPetRepository>;
    let appointmentRepository: jest.Mocked<IAppointmentRepository>;

    const mockPetRepository: Partial<jest.Mocked<IPetRepository>> = {
        updateClinic: jest.fn(),
    };

    const mockAppointmentRepository: Partial<jest.Mocked<IAppointmentRepository>> = {
        findByPetId: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateClinicUseCase,
                {
                    provide: "IPetRepository",
                    useValue: mockPetRepository,
                },
                {
                    provide: "IAppointmentRepository",
                    useValue: mockAppointmentRepository,
                },
            ],
        }).compile();

        useCase = module.get<UpdateClinicUseCase>(UpdateClinicUseCase);
        petRepository = module.get("IPetRepository");
        appointmentRepository = module.get("IAppointmentRepository");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(useCase).toBeDefined();
    });

    it("should successfully update clinic when pet has no active appointments", async () => {
        const petId = "pet-123";
        const clinicId = "clinic-456";

        const completedAppointment = AppointmentEntity.create({
            id: "app-1",
            date: new Date("2026-09-10T10:00:00Z"),
            reason: "Annual Checkup",
            status: AppointmentStatus.COMPLETED,
            petId,
            veterinarianId: "vet-1",
        });

        mockAppointmentRepository.findByPetId!.mockResolvedValue([completedAppointment]);
        mockPetRepository.updateClinic!.mockResolvedValue(undefined);

        await useCase.execute(petId, clinicId);

        expect(appointmentRepository.findByPetId).toHaveBeenCalledWith(petId);
        expect(petRepository.updateClinic).toHaveBeenCalledWith(petId, clinicId);
    });

    it("should successfully update clinic when pet has no appointments", async () => {
        const petId = "pet-123";
        const clinicId = "clinic-456";

        mockAppointmentRepository.findByPetId!.mockResolvedValue([]);
        mockPetRepository.updateClinic!.mockResolvedValue(undefined);

        await useCase.execute(petId, clinicId);

        expect(appointmentRepository.findByPetId).toHaveBeenCalledWith(petId);
        expect(petRepository.updateClinic).toHaveBeenCalledWith(petId, clinicId);
    });

    it("should throw ClinicChangeNotAllowedByAppointmentException and not call petRepository.updateClinic when pet has a SCHEDULED appointment", async () => {
        const petId = "pet-123";
        const clinicId = "clinic-456";

        const scheduledAppointment = AppointmentEntity.create({
            id: "app-2",
            date: new Date("2026-09-25T15:00:00Z"),
            reason: "Surgery follow-up",
            status: AppointmentStatus.SCHEDULED,
            petId,
            veterinarianId: "vet-1",
        });

        mockAppointmentRepository.findByPetId!.mockResolvedValue([scheduledAppointment]);

        await expect(useCase.execute(petId, clinicId)).rejects.toThrow(
            ClinicChangeNotAllowedByAppointmentException
        );

        expect(appointmentRepository.findByPetId).toHaveBeenCalledWith(petId);
        expect(petRepository.updateClinic).not.toHaveBeenCalled();
    });
});
