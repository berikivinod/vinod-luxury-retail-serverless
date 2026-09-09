"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGIndexer = void 0;
class RAGIndexer {
    embeddingProvider;
    vectorStore;
    constructor(embeddingProvider, vectorStore) {
        this.embeddingProvider = embeddingProvider;
        this.vectorStore = vectorStore;
    }
    async indexProduct(product) {
        const searchableText = this.buildSearchableText(product);
        console.log(`Creating embedding for product ${product.id}: ${product.name}`);
        const embedding = await this.embeddingProvider
            .createEmbedding(searchableText);
        if (embedding.length !== 1536) {
            throw new Error(`Expected 1536-dimensional embedding, received ${embedding.length}`);
        }
        const document = {
            productId: product.id,
            sku: product.sku,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            embedding,
            searchableText,
            metadata: {},
        };
        await this.vectorStore.upsert(document);
        console.log(`Product ${product.id} indexed successfully`);
        return document;
    }
    buildSearchableText(product) {
        return [
            product.name,
            product.brand,
            product.category,
            product.description,
            product.sku,
        ]
            .filter((value) => Boolean(value))
            .join(" ");
    }
}
exports.RAGIndexer = RAGIndexer;
