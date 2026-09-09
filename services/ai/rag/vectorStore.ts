import type {
    RAGIndexDocument,
} from "./ragIndexDocument";


/*
 * Deterministic filters that can be
 * applied during vector retrieval.
 *
 * These filters represent hard
 * customer requirements.
 */
export interface VectorSearchFilters {

    category?: string;

    productType?: string;

    brand?: string;

    color?: string;

    gender?: string;

    minPrice?: number;

    maxPrice?: number;

}


/*
 * Generic vector-store contract.
 *
 * The actual implementation will
 * eventually be Amazon OpenSearch.
 */
export interface VectorStore {

    /*
     * Add or update a product in the
     * vector index.
     */
    upsert(
        document: RAGIndexDocument
    ): Promise<void>;


    /*
     * Perform semantic vector search
     * with optional deterministic filters.
     */
    search(

        embedding: number[],

        options?: {

            limit?: number;

            filters?: VectorSearchFilters;

        }

    ): Promise<RAGIndexDocument[]>;


    /*
     * Remove a product from the
     * vector index.
     */
    delete(
        productId: number
    ): Promise<void>;

}