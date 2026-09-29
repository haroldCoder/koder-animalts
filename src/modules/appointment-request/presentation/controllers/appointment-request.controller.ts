import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateAppointmentRequestDto, RejectAppointmentRequestDto } from "../dtos";
import {
    CreateAppointmentRequestUseCase,
    ApproveAppointmentRequestUseCase,
    RejectAppointmentRequestUseCase,
    CancelAppointmentRequestUseCase,
    FindAppointmentsRequestUseCase,
} from "../../application/use-cases";
import { Roles } from "@user/presentation";
import { CurrentUser } from "../decorators";
import { ResponseDto } from "@/common/domain/dto";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { HttpException, HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { AppointmentRequestEntity } from "../../domain/entities";
import { CriteriaFindAllDto } from "../dtos/criteria-findall.dto";
import { ResponseAppointmentRequestDto } from "../../domain/dtos";

@ApiTags("appointment-requests")
@ApiBearerAuth()
@Controller("appointment-requests")
export class AppointmentRequestController {
    constructor(
        private readonly createUC: CreateAppointmentRequestUseCase,
        private readonly approveUC: ApproveAppointmentRequestUseCase,
        private readonly rejectUC: RejectAppointmentRequestUseCase,
        private readonly cancelUC: CancelAppointmentRequestUseCase,
        private readonly findUC: FindAppointmentsRequestUseCase,
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
        @Query("userVeterinarianId") userVeterinarianId: string,
        @Body() dto: RejectAppointmentRequestDto,
    ): Promise<ResponseDto<AppointmentRequestEntity>> {
        try {
            const rejected = await this.rejectUC.execute(id, userVeterinarianId, dto.reason);
            return new ResponseDto(HttpStatus.OK, "Appointment request rejected successfully", rejected);
        } catch (error: any) {
            console.log(error);

            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message || "Failed to reject appointment request");
        }
    }

    @Patch(":id/cancel")
    @Roles("OWNER")
    @ApiOperation({ summary: "Cancel an appointment request (Owner only)" })
    @ApiParam({ name: "id", description: "Appointment request ID" })
    @ApiResponse({ status: 200, description: "Appointment request cancelled successfully", type: ResponseDto })
    @ApiResponse({ status: 400, description: "User ID not found or invalid" })
    @ApiResponse({ status: 403, description: "Forbidden - owner cannot cancel this request or request is not pending" })
    @ApiResponse({ status: 404, description: "Appointment request or owner not found" })
    async cancel(
        @Param("id") id: string,
        @CurrentUser() user: any,
        @Query("ownerUserId") ownerUserId?: string,
    ): Promise<ResponseDto<AppointmentRequestEntity>> {
        try {
            const userId = user?.id || user?.userId || ownerUserId;
            const cancelled = await this.cancelUC.execute(id, userId);
            return new ResponseDto(HttpStatus.OK, "Appointment request cancelled successfully", cancelled);
        } catch (error: any) {
            console.log(error);

            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message || "Failed to cancel appointment request");
        }
    }

    @Get(":userId/user")
    @Roles("OWNER", "VETERINARIAN")
    @ApiOperation({ summary: "Find all appointment requests for a user (any role)" })
    @ApiParam({ name: "userId", description: "User ID" })
    @ApiResponse({ status: 200, description: "Appointment requests found successfully", type: ResponseDto })
    @ApiResponse({ status: 404, description: "User not found" })
    async findByUser(
        @Param("userId") userId: string,
        @Query() query?: CriteriaFindAllDto,
    ): Promise<ResponseDto<ResponseAppointmentRequestDto[]>> {
        try {
            const requests = await this.findUC.execute(userId, query);
            return new ResponseDto(HttpStatus.OK, "Appointment requests found successfully", requests);
        } catch (error: any) {
            console.log(error);

            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message || "Failed to find appointment requests");
        }
    }
}
