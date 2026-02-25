import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { UploadFileRepositoryPort } from "@/common/upload/domain/ports";
import { UploadFileResponseDto } from "@/common/upload/infrastructure/dto";
import { FolderUploadTypes } from "@/common/upload/domain/enums";
import { structureUpload } from "@/common/upload/domain/constants";

export class UploadFileS3Repository implements UploadFileRepositoryPort {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
        this.bucketName = process.env.AWS_S3_BUCKET_NAME || '';
    }

    async uploadFile(file: Express.Multer.File, folderType: FolderUploadTypes): Promise<UploadFileResponseDto> {
        const fileKey = `${Date.now()}-${file.originalname}`;

        const upload = new Upload({
            client: this.s3Client,
            params: {
                Bucket: this.bucketName,
                Key: `${structureUpload.folder}/${structureUpload[folderType]}/${fileKey}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            },
        });

        await upload.done();

        return {
            fileUrl: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${structureUpload.folder}/${structureUpload[folderType]}/${fileKey}`,
            fileKey,
            fileSize: file.size,
            fileType: file.mimetype,
        };
    }
}