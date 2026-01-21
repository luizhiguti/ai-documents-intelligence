import { semanticSearch } from "../services/search.service";
import { generateGroundedAnswer } from "./rag.llm";
import { RAGResult } from "./rag.types";

export async function answerQuestion(question: string): Promise<RAGResult> {
  // Retrieve similar documents
  const results = await semanticSearch(question, 5);

  if (!results.length) {
    return {
      answer: "I could not find relevant information in the documents",
      sources: [],
    };
  }

  // Build the context
  const contextBlocks = results.map((doc, i) => ({
    index: i + 1,
    id: doc._id.toString(),
    name: doc.originalName,
    text: doc.rawText.slice(0, 1500),
  }));

  return generateGroundedAnswer(question, contextBlocks);
}
