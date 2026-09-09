"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const openaiEmbeddingProvider_1 = require("./openaiEmbeddingProvider");
const openSearchVectorStore_1 = require("./openSearchVectorStore");
const ragResponseGenerator_1 = require("./ragResponseGenerator");
const queryUnderstanding_1 = require("./queryUnderstanding");
/*
 * -----------------------------------------
 * RAG Response Lambda
 * -----------------------------------------
 */
const handler = async (event) => {
    console.log("==============================================");
    console.log("VLR RAG Response Lambda started");
    console.log("==============================================");
    console.log("Event:", JSON.stringify(event));
    try {
        /*
         * -----------------------------------------
         * Parse request
         * -----------------------------------------
         */
        let request = {};
        /*
         * API Gateway / HTTP request
         */
        if (typeof event?.body === "string") {
            try {
                request =
                    JSON.parse(event.body);
            }
            catch (error) {
                console.error("Failed to parse request body", error);
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: "Request body contains invalid JSON",
                    }),
                };
            }
            /*
             * Lambda test event / object body
             */
        }
        else if (event?.body &&
            typeof event.body === "object") {
            request =
                event.body;
            /*
             * Direct Lambda invocation
             */
        }
        else {
            request =
                event;
        }
        /*
         * -----------------------------------------
         * Validate query
         * -----------------------------------------
         */
        const query = request.query?.trim();
        if (!query) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "query is required",
                    example: {
                        query: "Show me Gucci handbags under $2000",
                        limit: 5,
                    },
                }),
            };
        }
        /*
         * -----------------------------------------
         * Validate limit
         * -----------------------------------------
         */
        const requestedLimit = Number(request.limit ?? 5);
        if (!Number.isFinite(requestedLimit)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "limit must be a valid number",
                }),
            };
        }
        /*
         * -----------------------------------------
         * Normalize limit
         * -----------------------------------------
         *
         * Minimum = 1
         * Maximum = 10
         *
         * -----------------------------------------
         */
        const limit = Math.min(Math.max(Math.floor(requestedLimit), 1), 10);
        console.log(`Customer query: ${query}`);
        console.log(`Product retrieval limit: ${limit}`);
        /*
         * -----------------------------------------
         * Query Understanding
         * -----------------------------------------
         *
         * Convert natural-language customer
         * request into structured search filters.
         *
         * Example:
         *
         * "Show me Gucci handbags under $2000"
         *
         * becomes:
         *
         * {
         *   brand: "Gucci",
         *   category: "Handbags",
         *   maxPrice: 2000
         * }
         *
         * -----------------------------------------
         */
        console.log("Initializing query understanding");
        const queryUnderstanding = new queryUnderstanding_1.QueryUnderstanding();
        console.log("Extracting search filters from customer query");
        const aiFilters = await queryUnderstanding
            .extractFilters(query);
        console.log("AI extracted filters:", JSON.stringify(aiFilters));
        /*
         * -----------------------------------------
         * Optional manual filters
         * -----------------------------------------
         *
         * Manual filters are retained for
         * backward compatibility.
         *
         * AI filters take precedence when they
         * identify a value from the customer query.
         *
         * -----------------------------------------
         */
        const filters = {
            brand: aiFilters.brand ??
                request.filters?.brand,
            category: aiFilters.category ??
                request.filters?.category,
            maxPrice: aiFilters.maxPrice ??
                request.filters?.maxPrice,
        };
        /*
         * -----------------------------------------
         * Remove undefined values
         * -----------------------------------------
         */
        if (filters.brand === undefined) {
            delete filters.brand;
        }
        if (filters.category === undefined) {
            delete filters.category;
        }
        if (filters.maxPrice === undefined) {
            delete filters.maxPrice;
        }
        /*
         * -----------------------------------------
         * Determine whether filters exist
         * -----------------------------------------
         */
        const hasFilters = Object.keys(filters).length > 0;
        console.log(`Filters enabled: ${hasFilters}`);
        console.log("Final search filters:", JSON.stringify(filters));
        /*
         * -----------------------------------------
         * Create OpenAI embedding provider
         * -----------------------------------------
         */
        console.log("Initializing OpenAI embedding provider");
        const embeddingProvider = new openaiEmbeddingProvider_1.OpenAIEmbeddingProvider();
        /*
         * -----------------------------------------
         * Create OpenSearch vector store
         * -----------------------------------------
         */
        console.log("Initializing OpenSearch vector store");
        const vectorStore = new openSearchVectorStore_1.OpenSearchVectorStore();
        /*
         * -----------------------------------------
         * Create RAG response generator
         * -----------------------------------------
         */
        console.log("Initializing RAG response generator");
        const responseGenerator = new ragResponseGenerator_1.RAGResponseGenerator();
        /*
         * -----------------------------------------
         * Create query embedding
         * -----------------------------------------
         */
        console.log("Creating embedding for customer query");
        const embedding = await embeddingProvider
            .createEmbedding(query);
        console.log(`Query embedding dimensions: ${embedding.length}`);
        if (embedding.length !== 1536) {
            throw new Error(`Expected 1536-dimensional query embedding, received ${embedding.length}`);
        }
        /*
         * -----------------------------------------
         * Search OpenSearch
         * -----------------------------------------
         */
        console.log("Searching OpenSearch for relevant products");
        const products = await vectorStore.search(embedding, {
            limit,
            filters: hasFilters
                ? filters
                : undefined,
        });
        console.log(`Retrieved ${products.length} products from OpenSearch`);
        /*
         * -----------------------------------------
         * Log product information
         *
         * Never log the embedding itself.
         * -----------------------------------------
         */
        for (const product of products) {
            console.log({
                productId: product.productId,
                name: product.name,
                brand: product.brand,
                category: product.category,
                price: product.price,
                score: product.score,
            });
        }
        /*
         * -----------------------------------------
         * Generate grounded response
         * -----------------------------------------
         */
        console.log("Generating grounded RAG response");
        const answer = await responseGenerator
            .generateResponse(query, products);
        console.log("RAG response generated successfully");
        /*
         * -----------------------------------------
         * Return clean response
         * -----------------------------------------
         */
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "VLR RAG response generated",
                query,
                filters,
                retrievedProducts: products.length,
                products: products.map((product) => ({
                    productId: product.productId,
                    sku: product.sku,
                    name: product.name,
                    brand: product.brand,
                    category: product.category,
                    price: product.price,
                    score: product.score,
                })),
                answer,
            }),
        };
    }
    catch (error) {
        /*
         * -----------------------------------------
         * Detailed error logging
         * -----------------------------------------
         */
        console.error("==============================================");
        console.error("VLR RAG RESPONSE ERROR");
        console.error("==============================================");
        console.error("Error name:", error?.name);
        console.error("Error message:", error?.message);
        console.error("Error status code:", error?.statusCode);
        console.error("Error body:", JSON.stringify(error?.body));
        console.error("Error meta:", JSON.stringify(error?.meta));
        console.error("Full error:", JSON.stringify(error));
        console.error("==============================================");
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "VLR RAG response generation failed",
                error: error?.message ??
                    String(error),
                statusCode: error?.statusCode,
                errorBody: error?.body,
                errorMeta: error?.meta,
            }),
        };
    }
};
exports.handler = handler;
