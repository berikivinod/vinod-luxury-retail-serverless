import type {
  RAGIndexDocument,
} from "./ragIndexDocument";

export interface VectorSearchFilters {
  category?: string;
  brand?: string;
  maxPrice?: number;
}

export interface VectorStore {

  search(
    embedding: number[],
    options?: {
      limit?: number;
      filters?: VectorSearchFilters;
    }
  ): Promise<RAGIndexDocument[]>;
}