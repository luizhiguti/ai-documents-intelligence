import { openai } from "./llm.client";
import { RAGResult } from "./rag.types";

type RAGContext = {
  index: number;
  chunkId: string;
  documentId: string;
  documentName: string;
  text: string;
  score: number;
};

export async function generateGroundedAnswer(
  question: string,
  contexts: RAGContext[],
): Promise<RAGResult> {
  const systemPrompt = `
You are an AI assistant answering questions strictly using the provided document excerpts.

Rules:
- Use ONLY the provided context.
- Do NOT use outside knowledge.
- If the answer is not contained, say: "I don't have enough information to answer this."
- Be concise, factual, and neutral.
- Always return valid JSON.
- Always include citations.
`;

  const contextText = contexts
    .map(
      (c) => `[Source ${c.index}]
Document: ${c.documentName} (Id: ${c.documentId})
ChunkId: ${c.chunkId}

${c.text}`,
    )
    .join("\n\n---\n\n");

  const userPrompt = `
Context:
${contextText}

Question:
${question}

Return a JSON object in this exact format:

{
  "answer": "...",
  "sources": [
    {
      "documentId": "...",
      "documentName": "...",
      "chunkId": "...",
      "excerpt": "..."
    }
  ]
}

Rules for sources:
- Only cite sources you used.
- The excerpt must be copied from the context.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message.content || "{}";

  return JSON.parse(raw);
}
