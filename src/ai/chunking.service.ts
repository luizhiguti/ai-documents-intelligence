export function chunkText(text: string, size = 800, overlap = 100): string[] {
  const chunks: string[] = [];

  let start = 0;
  while (start < text.length) {
    const end = start + size;
    chunks.push(text.slice(start, end));
    start = end - overlap;
  }

  return chunks;
}
