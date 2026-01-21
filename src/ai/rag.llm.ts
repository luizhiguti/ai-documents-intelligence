import { openai } from "./llm.client";
import { RAGResult } from "./rag.types";

export async function generateGroundedAnswer(
  question: string,
  contexts: {
    index: number;
    id: string;
    name: string;
    text: string;
  }[],
): Promise<RAGResult> {
  const systemPrompt = `
You are an AI assistant answering questions ONLY using the provided document excerpts.

Rules:
- Use only the given context.
- If the answer is not contained, say you don't know.
- Be concise and factual.
- Always cite sources.
  `;

  const contextText = contexts
    .map(
      (c) => `[Source ${c.index}] (document: ${c.name}, id: ${c.id}) 
      ${c.text}`,
    )
    .join("\n\n");

  const userPrompt = `
Context: 
${contextText}

Question: 
${question}

Return a JSON object in this format:
{
  "answer": "...",
  "sources": [
    { "documentId": "...", "originalName": "...", "excerpt": "..." }
  ]
}
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
