import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { PetController } from "./pet.controller";
import {
    RegisterPetUseCase,
    UpdatePetUseCase,
    DeletePetUseCase,
    GetPetByIdUseCase,
    GetPetByVeterinarianIdUseCase,
    GetPetByOwnerIdUseCase,
    GetPetByUserOwnerUseCase,
    GetPetByVeterinarianUserIdUseCase,
    UpdateClinicUseCase,
} from "@pet/application/use-cases";
import { ClinicNotExistException } from "@veterinary-clinics/domain/exceptions";
import { ClinicIdNotFoundException } from "@veterinarian/domain/exceptions";
import {
    ClinicChangeNotAllowedByAppointmentException,
    PetIdNotExistException,
    PetIdNotFoundException,
} from "@/common/domain/exceptions";

describe("PetController", () => {
    let controller: PetController;

    const mockRegisterPetUseCase = { execute: jest.fn() };
    const mockUpdatePetUseCase = { execute: jest.fn() };
    const mockDeletePetUseCase = { execute: jest.fn() };
    const mockGetPetByIdUseCase = { execute: jest.fn() };
    const mockGetPetByVeterinarianIdUseCase = { execute: jest.fn() };
    const mockGetPetByOwnerIdUseCase = { execute: jest.fn() };
    const mockGetPetByUserOwnerUseCase = { execute: jest.fn() };
    const mockGetPetByVeterinarianUserIdUseCase = { execute: jest.fn() };
    const mockUpdateClinicUseCase = { execute: jest.fn() };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PetController],
            providers: [
                { provide: RegisterPetUseCase, useValue: mockRegisterPetUseCase },
                { provide: UpdatePetUseCase, useValue: mockUpdatePetUseCase },
                { provide: DeletePetUseCase, useValue: mockDeletePetUseCase },
                { provide: GetPetByIdUseCase, useValue: mockGetPetByIdUseCase },
                { provide: GetPetByVeterinarianIdUseCase, useValue: mockGetPetByVeterinarianIdUseCase },
                { provide: GetPetByOwnerIdUseCase, useValue: mockGetPetByOwnerIdUseCase },
                { provide: GetPetByUserOwnerUseCase, useValue: mockGetPetByUserOwnerUseCase },
                { provide: GetPetByVeterinarianUserIdUseCase, useValue: mockGetPetByVeterinarianUserIdUseCase },
                { provide: UpdateClinicUseCase, useValue: mockUpdateClinicUseCase },
            ],
        }).compile();

        controller = module.get<PetController>(PetController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("updateClinic", () => {
        const petId = "pet-123";
        const clinicId = "clinic-456";

        it("should return 200 OK and success message when clinic is updated successfully", async () => {
            mockUpdateClinicUseCase.execute.mockResolvedValue(undefined);

            const result = await controller.updateClinic(petId, { clinicId });

            expect(mockUpdateClinicUseCase.execute).toHaveBeenCalledWith(petId, clinicId);
            expect(result).toEqual({
                statusCode: HttpStatus.OK,
                message: "Clinic updated successfully",
            });
        });

        it("should rethrow ClinicNotExistException when use case throws ClinicNotExistException", async () => {
            const exception = new ClinicNotExistException(clinicId);
            mockUpdateClinicUseCase.execute.mockRejectedValue(exception);

            await expect(controller.updateClinic(petId, { clinicId })).rejects.toThrow(exception);
            expect(mockUpdateClinicUseCase.execute).toHaveBeenCalledWith(petId, clinicId);
        });

        it("should rethrow ClinicIdNotFoundException when use case throws ClinicIdNotFoundException", async () => {
            const exception = new ClinicIdNotFoundException();
            mockUpdateClinicUseCase.execute.mockRejectedValue(exception);

            await expect(controller.updateClinic(petId, { clinicId })).rejects.toThrow(exception);
        });

        it("should rethrow PetIdNotFoundException when use case throws PetIdNotFoundException", async () => {
            const exception = new PetIdNotFoundException();
            mockUpdateClinicUseCase.execute.mockRejectedValue(exception);

            await expect(controller.updateClinic(petId, { clinicId })).rejects.toThrow(exception);
        });

        it("should rethrow PetIdNotExistException when use case throws PetIdNotExistException", async () => {
            const exception = new PetIdNotExistException();
            mockUpdateClinicUseCase.execute.mockRejectedValue(exception);

            await expect(controller.updateClinic(petId, { clinicId })).rejects.toThrow(exception);
        });

        it("should rethrow ClinicChangeNotAllowedByAppointmentException when use case throws it", async () => {
            const exception = new ClinicChangeNotAllowedByAppointmentException();
            mockUpdateClinicUseCase.execute.mockRejectedValue(exception);

            await expect(controller.updateClinic(petId, { clinicId })).rejects.toThrow(exception);
        });

        it("should throw InternalServerErrorException when an unexpected error occurs", async () => {
            mockUpdateClinicUseCase.execute.mockRejectedValue(new Error("Database connection lost"));

            await expect(controller.updateClinic(petId, { clinicId })).rejects.toThrow(
                InternalServerErrorException
            );
        });
    });
});
