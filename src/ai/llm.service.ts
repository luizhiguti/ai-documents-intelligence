import { openai } from "./llm.client";
import { z } from "zod";

export const DocumentAnalysisSchema = z.object({
  summary: z.string(),
  category: z.string(),
  entities: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
    }),
  ),
});

export type DocumentAnalysis = z.infer<typeof DocumentAnalysisSchema>;

export async function analyzeDocumentText(
  text: string,
): Promise<DocumentAnalysis> {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
You are a document intelligence system.
Extract structured insights from documents.

Return ONLY valid JSON matching this exact schema:

{
  "summary": string,
  "category": string,
  "entities": [
    { "name": string, "type": string }
  ]
}

Rules:
- entities MUST always be an array.
- If no entities exist, return an empty array.
- Do not return markdown.
- Do not include explanations.
      `,
      },
      {
        role: "user",
        content: text.slice(0, 12_000),
      },
    ],
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message.content;

  if (!raw) {
    throw new Error("Empty LLM response");
  }

  const parsed = JSON.parse(raw);
  return DocumentAnalysisSchema.parse(parsed);
}
