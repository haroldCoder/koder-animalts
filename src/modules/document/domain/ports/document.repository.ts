import { DocumentModel, RegisterDocumentModel, UpdateDocumentModel } from "@document/domain/models";

export interface IDocumentRepository {
    registerDocument(document: RegisterDocumentModel): Promise<string>;
    updateDocument(document: UpdateDocumentModel, id: string): Promise<string>;
    deleteDocument(id: string): Promise<string>;
    getDocumentById(id: string): Promise<DocumentModel>;
}