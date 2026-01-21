import { DocumentModel } from "../models/document.model";
import { generateEmbedding } from "../ai/embedding.service";
import { ChunkModel } from "../models/chunk.model";

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

export async function semanticChunkSearch(query: string, limit = 8) {
  const vector = await generateEmbedding(query);

  return ChunkModel.aggregate([
    {
      $vectorSearch: {
        index: "chunk_embeddings",
        path: "embedding",
        queryVector: vector,
        numCandidates: 200,
        limit,
      },
    },
    {
      $lookup: {
        from: "documents",
        localField: "documentId",
        foreignField: "_id",
        as: "document",
      },
    },
    {
      $unwind: "$document",
    },
    {
      $addFields: {
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);
}
