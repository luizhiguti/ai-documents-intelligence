import { DocumentModel } from "../models/document.model";
import { generateEmbedding } from "../ai/embedding.service";

export async function semanticSearch(query: string, limit = 5) {
  const vector = await generateEmbedding(query);

  const results = await DocumentModel.aggregate([
    {
      $vectorSearch: {
        index: "document_embeddings",
        path: "embedding",
        queryVector: vector,
        numCandidates: 100,
        limit,
      },
    },
    {
      $addFields: {
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  return results;
}
