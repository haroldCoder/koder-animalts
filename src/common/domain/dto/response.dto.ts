import { PaginationDto } from "@/common/interfaces";

export class ResponseDto<T> {
    data?: T;
    message?: string;
    statusCode: number;
    pagination?: PaginationDto;

    constructor(statusCode: number, message?: string, data?: T, pagination?: PaginationDto) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
        this.pagination = pagination;
    }
}