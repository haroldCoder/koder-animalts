export class ResponseDto<T> {
    data?: T;
    message?: string;
    statusCode: number;

    constructor(statusCode: number, message?: string, data?: T) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
    }
}