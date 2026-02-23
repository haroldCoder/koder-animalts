export class ResponseDto<T> {
    data?: T;
    message: string;
    statusCode: number;

    constructor(message: string, statusCode: number, data?: T) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
    }
}