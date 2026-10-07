import { BadRequestException } from "@nestjs/common";

export class UploadFilesPolicy {
    static fileHaveValidSize(file: Express.Multer.File) {
        if (file.size > 50 * 1024 * 1024) {
            throw new BadRequestException('the file must be less than 50MB');
        }
    }
}