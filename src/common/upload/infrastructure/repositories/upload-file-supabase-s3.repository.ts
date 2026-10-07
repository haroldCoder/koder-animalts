import { Injectable } from "@nestjs/common";
import { UploadFileRepositoryPort } from "../../domain/ports";
import { UploadFileResponseDto } from "../dto";
import { FolderUploadTypes } from "../../domain/enums";
import { SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class UploadFileSupabaseS3Repository implements UploadFileRepositoryPort {
    private supabase: SupabaseClient;
    private bucketName: string = "koder-animalts-bucket";
    private identifier: string | null;

    constructor(id?: string) {
        this.supabase = new SupabaseClient(
            process.env.SUPABASE_URL || "",
            process.env.SUPABASE_ANON_KEY || "",
            {
                auth: {
                    persistSession: false,
                },
            }
        )
        this.identifier = id || null;
    }

    async uploadFile(file: Express.Multer.File, folderType: FolderUploadTypes): Promise<UploadFileResponseDto> {
        const fileName = `${Date.now()}-${file.originalname}`;
        const fileKey = `${folderType}${this.identifier && '/' + this.identifier}/${fileName}`;

        const { data, error } = await this.supabase.storage
            .from(this.bucketName)
            .upload(fileKey, file.buffer, {
                contentType: file.mimetype,
            });

        if (error) {
            throw error;
        }

        return {
            fileUrl: await this.getPublicUrl(data.path),
            fileKey,
            fileSize: file.size,
            fileType: file.mimetype,
        };
    }

    private async getPublicUrl(filePath: string): Promise<string> {
        const { data } = this.supabase.storage
            .from(this.bucketName)
            .getPublicUrl(filePath);

        return data.publicUrl;
    }
}