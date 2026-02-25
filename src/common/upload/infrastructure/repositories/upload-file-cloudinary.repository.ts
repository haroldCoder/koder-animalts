import { v2 as cloudinary } from "cloudinary";
import { UploadFileRepositoryPort } from "@/common/upload/domain/ports";
import { UploadFileResponseDto } from "@/common/upload/infrastructure/dto";
import { structureUpload } from "@/common/upload/domain/constants";
import { FolderUploadTypes } from "@/common/upload/domain/enums";

export class UploadFileCloudinaryRepository implements UploadFileRepositoryPort {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async uploadFile(file: Express.Multer.File, folderType: FolderUploadTypes): Promise<UploadFileResponseDto> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: `${structureUpload.folder}/${structureUpload[folderType]}`,
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error("Cloudinary upload failed"));
                    resolve({
                        fileUrl: result.secure_url,
                        fileKey: result.public_id,
                        fileSize: result.bytes,
                        fileType: result.format,
                    });
                }
            );

            uploadStream.end(file.buffer);
        });
    }
}