import { Module } from "@nestjs/common";
import { DocumentService, DocumentController } from "@document/infrastructure";

@Module({
    controllers: [DocumentController],
    providers: [DocumentService],
    exports: [DocumentService]
})
export class DocumentModule { }
