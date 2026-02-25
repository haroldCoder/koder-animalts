import { UploadFileResponseDto } from "@/common/upload/infrastructure/dto";
import { FolderUploadTypes } from "@/common/upload/domain/enums";

export interface UploadFileRepositoryPort {
    uploadFile(file: Express.Multer.File, folderType: FolderUploadTypes): Promise<UploadFileResponseDto>;
}