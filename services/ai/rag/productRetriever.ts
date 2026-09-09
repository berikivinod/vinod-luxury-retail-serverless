import type {
    StylePreferences,
} from "@/types/ai";

import type {
    RAGIndexDocument,
} from "./ragIndexDocument";

import type {
    EmbeddingProvider,
} from "./embeddingProvider";

import type {
    VectorSearchFilters,
    VectorStore,
} from "./vectorStore";


/*
 * Options used when performing
 * semantic product retrieval.
 */
export interface RAGSearchOptions {

    /*
     * Maximum number of products
     * returned by the vector store.
     */
    limit?: number;

}


/*
 * Product Retriever
 *
 * Responsible for:
 *
 * 1. Creating a semantic embedding
 *    from the customer's request.
 *
 * 2. Converting the customer's
 *    structured preferences into
 *    deterministic filters.
 *
 * 3. Passing both the embedding and
 *    filters to the configured
 *    VectorStore.
 *
 * The actual vector-store implementation
 * is intentionally separated from this
 * class.
 */
export class ProductRetriever {

    constructor(

        private readonly embeddingProvider:
            EmbeddingProvider,

        private readonly vectorStore:
            VectorStore

    ) {}


    /*
     * Search for semantically relevant
     * products while respecting the
     * customer's current preferences.
     */
    async search(

        query: string,

        preferences: StylePreferences,

        options:
            RAGSearchOptions = {}

    ): Promise<RAGIndexDocument[]> {


        /*
         * Default retrieval size.
         *
         * We retrieve more candidates than
         * the final UI normally displays.
         */
        const limit =
            options.limit ?? 10;


        /*
         * --------------------------------
         * STEP 1
         *
         * Create semantic query embedding.
         * --------------------------------
         */

        const embedding =
            await this.embeddingProvider
                .createEmbedding(
                    query
                );


        /*
         * --------------------------------
         * STEP 2
         *
         * Build deterministic filters
         * from the customer's structured
         * preferences.
         *
         * These are NOT semantic.
         *
         * They represent requirements that
         * should constrain retrieval.
         * --------------------------------
         */

        const filters:
            VectorSearchFilters = {};


        /*
         * Category
         *
         * Example:
         *
         * category = "Shoes"
         */
        if (
            preferences.category
        ) {

            filters.category =
                preferences.category;

        }


        /*
         * Product type
         *
         * Example:
         *
         * productType = "Loafers"
         */
        if (
            preferences.productType
        ) {

            filters.productType =
                preferences.productType;

        }


        /*
         * Brand
         *
         * Example:
         *
         * brand = "VLR Signature"
         */
        if (
            preferences.brand
        ) {

            filters.brand =
                preferences.brand;

        }


        /*
         * Color
         *
         * Example:
         *
         * color = "Black"
         */
        if (
            preferences.color
        ) {

            filters.color =
                preferences.color;

        }


        /*
         * Gender
         *
         * Example:
         *
         * gender = "Women"
         */
        if (
            preferences.gender
        ) {

            filters.gender =
                preferences.gender;

        }


        /*
         * Minimum price.
         *
         * Example:
         *
         * minPrice = 500
         */
        if (
            preferences.minPrice !==
            undefined
        ) {

            filters.minPrice =
                preferences.minPrice;

        }


        /*
         * Maximum price.
         *
         * Example:
         *
         * maxPrice = 1200
         */
        if (
            preferences.maxPrice !==
            undefined
        ) {

            filters.maxPrice =
                preferences.maxPrice;

        }


        console.log(
            "RAG Search Query:",
            query
        );


        console.log(
            "RAG Search Preferences:",
            preferences
        );


        console.log(
            "RAG Vector Filters:",
            filters
        );


        /*
         * --------------------------------
         * STEP 3
         *
         * Search the configured vector
         * store.
         *
         * The VectorStore implementation
         * will eventually translate these
         * filters into the appropriate
         * OpenSearch query.
         * --------------------------------
         */

        const products =
            await this.vectorStore.search(

                embedding,

                {

                    limit,

                    filters,

                }

            );


        /*
         * --------------------------------
         * STEP 4
         *
         * Return the retrieved RAG
         * documents.
         *
         * The caller will later convert
         * these into actual catalog
         * products and validate them
         * against DynamoDB.
         * --------------------------------
         */

        return products;

    }

}