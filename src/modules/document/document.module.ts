import { Module } from "@nestjs/common";
import { DocumentService } from "@document/infrastructure/document.service";
import { DocumentController } from "@document/infrastructure/document.controller";
import { PrismaService } from "@/common/infrastructure/db";

@Module({
    controllers: [DocumentController],
    providers: [DocumentService, PrismaService],
    exports: [DocumentService]
})
export class DocumentModule { }
