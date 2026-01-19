import "dotenv/config";
import { analyzeDocumentText } from "./llm.service";

async function test() {
  const result = await analyzeDocumentText(`
Invoice #44521
Customer: John Doe
Company: ACME Corp
Total: $1,200
Due date: Feb 10, 2026
  `);

  console.log(JSON.stringify(result, null, 2));
}

test();
