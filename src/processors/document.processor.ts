import { DocumentModel } from "../models/document.model";
import { analyzeDocumentText } from "../ai/llm.service";
import { generateEmbedding } from "../ai/embedding.service";
import { chunkText } from "../ai/chunking.service";
import { ChunkModel } from "../models/chunk.model";

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
    const documentEmbedding = await generateEmbedding(
      `${analysis.summary}\n${doc.rawText}`,
    );

    const chunks = chunkText(doc.rawText);

    // avoid duplicated chunks
    await ChunkModel.deleteMany({ documentId: doc._id });

    for (let i = 0; i < chunks.length; i++) {
      const chunksEmbedding = await generateEmbedding(chunks[i] as string);

      await ChunkModel.create({
        documentId: doc._id,
        text: chunks[i],
        embedding: chunksEmbedding,
        index: i,
      });
    }

    await DocumentModel.findByIdAndUpdate(documentId, {
      status: "processed",
      analysis,
      embedding: documentEmbedding,
    });
  } catch (err: any) {
    await DocumentModel.findByIdAndUpdate(documentId, {
      status: "failed",
      error: err.message || "Processing failed",
    });

    throw err;
  }
}
