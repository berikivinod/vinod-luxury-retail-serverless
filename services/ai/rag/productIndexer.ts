import type {
    Product,
} from "@/types/product";

import {
    buildRAGProductDocument,
} from "./productDocument";

import type {
    EmbeddingProvider,
} from "./embeddingProvider";

import type {
    RAGIndexDocument,
} from "./ragIndexDocument";

import type {
    VectorStore,
} from "./vectorStore";


export class ProductIndexer {

    constructor(

        private readonly embeddingProvider:
            EmbeddingProvider,

        private readonly vectorStore:
            VectorStore

    ) {}



    async indexProduct(
        product: Product
    ): Promise<RAGIndexDocument> {


        /*
         * Convert the catalog product into
         * the RAG representation.
         */

        const ragDocument =
            buildRAGProductDocument(
                product
            );


        /*
         * Generate the semantic embedding
         * from searchableText.
         */

        const embedding =
            await this.embeddingProvider
                .createEmbedding(
                    ragDocument.searchableText
                );


        /*
         * Create the final vector-store
         * document.
         */

        const indexDocument:
            RAGIndexDocument = {

            productId:
                ragDocument.productId,

            sku:
                ragDocument.sku,

            name:
                ragDocument.name,

            brand:
                ragDocument.brand,

            category:
                ragDocument.category,

            price:
                ragDocument.price,

            embedding,

            searchableText:
                ragDocument.searchableText,

            metadata:
                ragDocument.metadata,

        };


        /*
         * Store/update the product in the
         * vector store.
         */

        await this.vectorStore.upsert(
            indexDocument
        );


        console.log(
            "RAG product indexed:",
            product.id
        );


        return indexDocument;

    }

}