import { DocumentModel, IDocument } from "../models/document.model";

export async function createDocument(data: {
  source: string;
  originalName: string;
  mimeType: string;
  rawText: string;
}) {
  return DocumentModel.create(data);
}

export async function getDocumentById(id: string) {
  return DocumentModel.findById(id);
}
