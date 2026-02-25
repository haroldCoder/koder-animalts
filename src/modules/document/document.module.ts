import { Module } from "@nestjs/common";
import { DocumentService } from "@document/infrastructure/document.service";
import { DocumentController } from "@document/infrastructure/document.controller";

@Module({
    controllers: [DocumentController],
    providers: [DocumentService],
    exports: [DocumentService]
})
export class DocumentModule { }
