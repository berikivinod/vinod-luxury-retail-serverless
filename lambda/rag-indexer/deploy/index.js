"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const productRepository_1 = require("./productRepository");
const openaiEmbeddingProvider_1 = require("./openaiEmbeddingProvider");
const openSearchVectorStore_1 = require("./openSearchVectorStore");
const ragIndexer_1 = require("./ragIndexer");
const handler = async () => {
    console.log("VLR RAG Indexer Lambda started");
    try {
        const productRepository = new productRepository_1.ProductRepository();
        const embeddingProvider = new openaiEmbeddingProvider_1.OpenAIEmbeddingProvider();
        const vectorStore = new openSearchVectorStore_1.OpenSearchVectorStore();
        const ragIndexer = new ragIndexer_1.RAGIndexer(embeddingProvider, vectorStore);
        const products = await productRepository
            .getAllProducts();
        console.log(`Retrieved ${products.length} products from DynamoDB`);
        let indexed = 0;
        let failed = 0;
        const failures = [];
        for (const product of products) {
            try {
                const document = await ragIndexer
                    .indexProduct(product);
                indexed++;
                console.log(`Indexed product ${document.productId}: ${document.name}`);
            }
            catch (error) {
                failed++;
                const message = error instanceof Error
                    ? error.message
                    : String(error);
                failures.push({
                    productId: product.id,
                    error: message,
                });
                console.error(`Failed to index product ${product.id}`, error);
            }
        }
        console.log(`RAG indexing complete. Total=${products.length}, Indexed=${indexed}, Failed=${failed}`);
        return {
            statusCode: failed === 0 ? 200 : 500,
            body: JSON.stringify({
                message: "VLR RAG indexing completed",
                totalProducts: products.length,
                indexed,
                failed,
                failures,
            }),
        };
    }
    catch (error) {
        console.error("RAG indexing failed", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "RAG indexing failed",
                error: error instanceof Error
                    ? error.message
                    : String(error),
            }),
        };
    }
};
exports.handler = handler;
