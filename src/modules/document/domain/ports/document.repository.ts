import { DocumentModel, RegisterDocumentModel, UpdateDocumentModel, FindDocumentsCriteria } from "@document/domain/models";

export interface IDocumentRepository {
    registerDocument(document: RegisterDocumentModel): Promise<string>;
    updateDocument(document: UpdateDocumentModel, id: string): Promise<string>;
    deleteDocument(id: string): Promise<string>;
    getDocumentById(id: string): Promise<DocumentModel>;
    findDocumentsByUserId(userId: string, criteria: FindDocumentsCriteria): Promise<DocumentModel[]>;
}