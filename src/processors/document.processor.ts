import { DocumentModel } from "../models/document.model";
import { analyzeDocumentText } from "../ai/llm.service";

export async function processDocument(documentId: string) {
  const doc = await DocumentModel.findById(documentId);

  if (!doc) {
    throw new Error("Document not found");
  }

  if (doc.status !== "uploaded") return;

  try {
    await DocumentModel.findByIdAndUpdate(documentId, {
      status: "processing",
      error: null,
    });

    const analysis = await analyzeDocumentText(doc.rawText);

    await DocumentModel.findByIdAndUpdate(documentId, {
      status: "processed",
      analysis,
    });
  } catch (err: any) {
    await DocumentModel.findByIdAndUpdate(documentId, {
      status: "failed",
      error: err.message || "Processing failed",
    });

    throw err;
  }
}
