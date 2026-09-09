export interface RAGIndexDocument {

  productId: number;

  sku?: string;

  name: string;

  brand: string;

  category: string;

  price: number;

  embedding: number[];

  searchableText: string;

  metadata: Record<string, unknown>;
}