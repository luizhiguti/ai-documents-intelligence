import {
  semanticChunkSearch,
  semanticSearch,
} from "../services/search.service";
import { generateGroundedAnswer } from "./rag.llm";
import { RAGResult } from "./rag.types";

export async function answerQuestion(question: string): Promise<RAGResult> {
  // Retrieve similar documents
  const results = await semanticChunkSearch(question, 6);

  if (!results.length) {
    return {
      answer: "I could not find relevant information in the documents",
      sources: [],
    };
  }

  // Build the context
  const contextBlocks = results.map((chunk, i) => ({
    index: i + 1,
    chunkId: chunk._id.toString(),
    documentId: chunk.document._id.toString(),
    documentName: chunk.document.originalName,
    text: chunk.text,
    score: chunk.score,
  }));

  return generateGroundedAnswer(question, contextBlocks);
}
