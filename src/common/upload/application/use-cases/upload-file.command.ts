import { FolderUploadTypes, UploadPlatformEnum } from "@/common/upload/domain/enums";
import { UploadFileResponseDto } from "@/common/upload/infrastructure/dto";
import { UploadFileCloudinaryRepository, UploadFileS3Repository } from "@/common/upload/infrastructure/repositories";
import { UploadFileSupabaseS3Repository } from "../../infrastructure/repositories/upload-file-supabase-s3.repository";
import { UploadFilesPolicy } from "../../domain/policies";

export class UploadFileCommand {
    file: Express.Multer.File;
    platform: UploadPlatformEnum;
    folderType: FolderUploadTypes;

    constructor(file: Express.Multer.File, platform: UploadPlatformEnum, folderType: FolderUploadTypes) {
        this.file = file;
        this.platform = platform;
        this.folderType = folderType;
    }

    async execute(id?: string): Promise<UploadFileResponseDto> {
        UploadFilesPolicy.fileHaveValidSize(this.file);

        if (this.platform === UploadPlatformEnum.CLOUDINARY) {
            return new UploadFileCloudinaryRepository().uploadFile(this.file, this.folderType);
        }
        if (this.platform === UploadPlatformEnum.SUPABASE) {
            return new UploadFileSupabaseS3Repository(id).uploadFile(this.file, this.folderType);
        }
        return new UploadFileS3Repository().uploadFile(this.file, this.folderType);
    }
}