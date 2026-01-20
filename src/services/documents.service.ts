import { QueryFilter } from "mongoose";
import { DocumentModel, IDocument } from "../models/document.model";
import { processDocument } from "../processors/document.processor";

export async function createDocument(data: {
  source: "upload" | "api" | "email";
  originalName: string;
  mimeType: string;
  rawText: string;
}) {
  const doc = await DocumentModel.create({
    ...data,
    status: "uploaded",
  });

  // fire and forget
  processDocument(doc.id).catch(console.error);

  return doc;
}

export async function getDocumentById(id: string) {
  return DocumentModel.findById(id);
}

export async function listDocuments(options: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const { status, limit = 10, offset = 0 } = options;

  const query: QueryFilter<IDocument> = {};
  if (status) query.status = status;

  const [items, total] = await Promise.all([
    DocumentModel.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean(),
    DocumentModel.countDocuments(query),
  ]);

  return {
    items,
    total,
    limit,
    offset,
  };
}
