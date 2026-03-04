import { Module } from "@nestjs/common";
import { PrismaDocumentService } from "@document/infrastructure";
import { DocumentController } from "@document/presentation";
import {
    DeleteDocumentUseCase,
    GetDocumentByIdUseCase,
    RegisterDocumentUseCase,
    UpdateDocumentUseCase
} from "@document/application/use-cases";

@Module({
    controllers: [DocumentController],
    providers: [
        {
            provide: "IDocumentRepository",
            useClass: PrismaDocumentService,
        },
        RegisterDocumentUseCase,
        UpdateDocumentUseCase,
        DeleteDocumentUseCase,
        GetDocumentByIdUseCase,
    ],
    exports: [
        "IDocumentRepository",
        RegisterDocumentUseCase,
        UpdateDocumentUseCase,
        DeleteDocumentUseCase,
        GetDocumentByIdUseCase,
    ]
})
export class DocumentModule { }

