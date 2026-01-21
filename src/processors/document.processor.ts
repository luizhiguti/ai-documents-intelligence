import { DocumentModel } from "../models/document.model";
import { analyzeDocumentText } from "../ai/llm.service";
import { generateEmbedding } from "../ai/embedding.service";

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
    const embedding = await generateEmbedding(
      `${analysis.summary}\n${doc.rawText}`,
    );

    await DocumentModel.findByIdAndUpdate(documentId, {
      status: "processed",
      analysis,
      embedding,
    });
  } catch (err: any) {
    await DocumentModel.findByIdAndUpdate(documentId, {
      status: "failed",
      error: err.message || "Processing failed",
    });

    throw err;
  }
}
