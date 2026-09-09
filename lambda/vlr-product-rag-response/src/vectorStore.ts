import type {
  RAGIndexDocument,
} from "./ragIndexDocument";


/*
 * -----------------------------------------
 * Search filters
 * -----------------------------------------
 */

export interface VectorSearchFilters {

  category?: string;

  brand?: string;

  maxPrice?: number;

}


/*
 * -----------------------------------------
 * Retrieved product
 *
 * Includes the OpenSearch similarity score.
 * -----------------------------------------
 */

export interface VectorSearchResult
  extends RAGIndexDocument {

  score: number;

}


/*
 * -----------------------------------------
 * Vector store interface
 * -----------------------------------------
 */

export interface VectorStore {

  search(

    embedding: number[],

    options?: {

      limit?: number;

      filters?: VectorSearchFilters;

    }

  ): Promise<VectorSearchResult[]>;

}