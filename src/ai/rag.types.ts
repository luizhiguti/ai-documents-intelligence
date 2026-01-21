export interface RAGSource {
  documentId: string;
  originalName: string;
  excerpt: string;
}

export interface RAGResult {
  answer: string;
  sources: RAGSource[];
}
