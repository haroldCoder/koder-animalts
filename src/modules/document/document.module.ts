import { Module } from "@nestjs/common";
import { PrismaDocumentService } from "@document/infrastructure";
import { DocumentController } from "@document/presentation";
import {
    DeleteDocumentUseCase,
    GetDocumentByIdUseCase,
    RegisterDocumentUseCase,
    UpdateDocumentUseCase,
    FindDocumentsByUserIdUseCase
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
        FindDocumentsByUserIdUseCase,
    ],
    exports: [
        "IDocumentRepository",
        RegisterDocumentUseCase,
        UpdateDocumentUseCase,
        DeleteDocumentUseCase,
        GetDocumentByIdUseCase,
        FindDocumentsByUserIdUseCase,
    ]
})
export class DocumentModule { }

