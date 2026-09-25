import { Body, Controller, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateAppointmentRequestDto, RejectAppointmentRequestDto } from "../dtos";
import { CreateAppointmentRequestUseCase, ApproveAppointmentRequestUseCase, RejectAppointmentRequestUseCase } from "../../application/use-cases";
import { Roles } from "@user/presentation";
import { CurrentUser } from "../decorators";
import { ResponseDto } from "@/common/domain/dto";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { HttpException, HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { AppointmentRequestEntity } from "../../domain/entities";

@ApiTags("appointment-requests")
@ApiBearerAuth()
@Controller("appointment-requests")
export class AppointmentRequestController {
    constructor(
        private readonly createUC: CreateAppointmentRequestUseCase,
        private readonly approveUC: ApproveAppointmentRequestUseCase,
        private readonly rejectUC: RejectAppointmentRequestUseCase,
    ) { }

    @Post()
    @Roles("OWNER")
    @ApiOperation({ summary: "Create a new appointment request (Owner only)" })
    @ApiResponse({ status: 201, description: "Appointment request created successfully", type: ResponseDto })
    @ApiResponse({ status: 400, description: "Validation error or invalid data" })
    @ApiResponse({ status: 403, description: "Forbidden - user is not an owner" })
    async create(
        @CurrentUser() user: any,
        @Body() dto: CreateAppointmentRequestDto,
    ): Promise<ResponseDto<string>> {
        try {
            const id = await this.createUC.execute({ ...dto, requestedDate: new Date(dto.requestedDate) });
            return new ResponseDto(HttpStatus.CREATED, "Appointment request created successfully", id);
        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message || "Failed to create appointment request");
        }
    }

    @Patch(":id/approve")
    @Roles("VETERINARIAN")
    @ApiOperation({ summary: "Approve an appointment request (Veterinarian only)" })
    @ApiParam({ name: "id", description: "Appointment request ID" })
    @ApiResponse({ status: 200, description: "Appointment request approved and appointment created", type: ResponseDto })
    @ApiResponse({ status: 403, description: "Forbidden - veterinarian cannot approve this request" })
    @ApiResponse({ status: 404, description: "Appointment request or clinic not found" })
    async approve(
        @Param("id") id: string,
        @Query("userVeterinarianId") userVeterinarianId: string,
        @Query("clinicId") clinicId: string,
        @Query("notes") notes?: string
    ): Promise<ResponseDto<string>> {
        try {
            const appointmentId = await this.approveUC.execute(id, userVeterinarianId, clinicId, notes);
            return new ResponseDto(HttpStatus.OK, "Appointment request approved successfully", appointmentId);
        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message || "Failed to approve appointment request");
        }
    }

    @Patch(":id/reject")
    @Roles("VETERINARIAN")
    @ApiOperation({ summary: "Reject an appointment request (Veterinarian only)" })
    @ApiParam({ name: "id", description: "Appointment request ID" })
    @ApiResponse({ status: 200, description: "Appointment request rejected successfully", type: ResponseDto })
    @ApiResponse({ status: 403, description: "Forbidden - veterinarian cannot reject this request" })
    @ApiResponse({ status: 404, description: "Appointment request not found" })
    async reject(
        @Param("id") id: string,
        @CurrentUser() vet: any,
        @Body() dto: RejectAppointmentRequestDto,
    ): Promise<ResponseDto<AppointmentRequestEntity>> {
        try {
            const rejected = await this.rejectUC.execute(id, vet.id, vet.clinicId, dto.reason);
            return new ResponseDto(HttpStatus.OK, "Appointment request rejected successfully", rejected);
        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message || "Failed to reject appointment request");
        }
    }
}
