import type {
  RAGIndexDocument,
} from "./ragIndexDocument";

export interface VectorSearchFilters {
  category?: string;

  productType?: string;

  brand?: string;

  color?: string;

  gender?: string;

  minPrice?: number;

  maxPrice?: number;
}

export interface VectorStore {
  upsert(
    document: RAGIndexDocument
  ): Promise<void>;

  search(
    embedding: number[],
    options?: {
      limit?: number;
      filters?: VectorSearchFilters;
    }
  ): Promise<RAGIndexDocument[]>;

  delete(
    productId: number
  ): Promise<void>;
}