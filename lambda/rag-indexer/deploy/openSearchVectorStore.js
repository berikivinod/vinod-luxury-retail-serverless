"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenSearchVectorStore = void 0;
const opensearch_1 = require("@opensearch-project/opensearch");
const aws_1 = require("@opensearch-project/opensearch/aws");
const credential_provider_node_1 = require("@aws-sdk/credential-provider-node");
class OpenSearchVectorStore {
    client;
    indexName = "products";
    indexReady;
    constructor() {
        const endpoint = process.env.OPENSEARCH_ENDPOINT;
        if (!endpoint) {
            throw new Error("OPENSEARCH_ENDPOINT environment variable is not configured");
        }
        const region = process.env.AWS_REGION ?? "us-east-2";
        console.log(`Initializing OpenSearch Serverless client. Region=${region}`);
        console.log(`OpenSearch endpoint=${endpoint}`);
        this.client =
            new opensearch_1.Client({
                ...(0, aws_1.AwsSigv4Signer)({
                    region,
                    service: "aoss",
                    getCredentials: (0, credential_provider_node_1.defaultProvider)(),
                }),
                node: endpoint,
            });
    }
    /*
     * -----------------------------------------
     * Ensure products index exists
     * -----------------------------------------
     *
     * The index must be created explicitly
     * because OpenSearch dynamic mapping would
     * otherwise map the embedding array as
     * a normal float field.
     *
     * Required vector mapping:
     *
     * embedding:
     *   type       = knn_vector
     *   dimension  = 1536
     * -----------------------------------------
     */
    async ensureIndex() {
        if (!this.indexReady) {
            this.indexReady =
                this.createIndexIfNeeded();
        }
        await this.indexReady;
    }
    async createIndexIfNeeded() {
        console.log(`Checking OpenSearch index: ${this.indexName}`);
        try {
            /*
             * -----------------------------------------
             * Check whether the index already exists
             * -----------------------------------------
             */
            try {
                await this.client.indices.get({
                    index: this.indexName,
                });
                console.log(`OpenSearch index already exists: ${this.indexName}`);
                /*
                 * We do NOT modify an existing index.
                 *
                 * If the existing index has the wrong
                 * mapping, delete it first and then
                 * allow this method to create it again.
                 */
                return;
            }
            catch (error) {
                if (error?.statusCode !== 404) {
                    throw error;
                }
                console.log(`OpenSearch index does not exist: ${this.indexName}`);
            }
            /*
             * -----------------------------------------
             * Create index with explicit vector mapping
             * -----------------------------------------
             */
            console.log(`Creating OpenSearch vector index: ${this.indexName}`);
            await this.client.indices.create({
                index: this.indexName,
                body: {
                    settings: {
                        index: {
                            knn: true,
                        },
                    },
                    mappings: {
                        properties: {
                            productId: {
                                type: "integer",
                            },
                            sku: {
                                type: "text",
                                fields: {
                                    keyword: {
                                        type: "keyword",
                                        ignore_above: 256,
                                    },
                                },
                            },
                            name: {
                                type: "text",
                                fields: {
                                    keyword: {
                                        type: "keyword",
                                        ignore_above: 256,
                                    },
                                },
                            },
                            brand: {
                                type: "text",
                                fields: {
                                    keyword: {
                                        type: "keyword",
                                        ignore_above: 256,
                                    },
                                },
                            },
                            category: {
                                type: "text",
                                fields: {
                                    keyword: {
                                        type: "keyword",
                                        ignore_above: 256,
                                    },
                                },
                            },
                            price: {
                                type: "float",
                            },
                            embedding: {
                                type: "knn_vector",
                                dimension: 1536,
                            },
                            searchableText: {
                                type: "text",
                                fields: {
                                    keyword: {
                                        type: "keyword",
                                        ignore_above: 256,
                                    },
                                },
                            },
                            metadata: {
                                type: "object",
                            },
                        },
                    },
                },
            });
            console.log(`OpenSearch vector index created successfully: ${this.indexName}`);
        }
        catch (error) {
            /*
             * -----------------------------------------
             * Handle race condition
             * -----------------------------------------
             */
            if (error?.statusCode === 400 &&
                error?.body?.error?.type ===
                    "resource_already_exists_exception") {
                console.log(`OpenSearch index already created by another invocation: ${this.indexName}`);
                return;
            }
            console.error("OpenSearch index initialization failed");
            console.error("Error name:", error?.name);
            console.error("Error message:", error?.message);
            console.error("Error status code:", error?.statusCode);
            console.error("Error body:", JSON.stringify(error?.body));
            console.error("Error meta:", JSON.stringify(error?.meta));
            throw error;
        }
    }
    /*
     * -----------------------------------------
     * DELETE ENTIRE PRODUCTS INDEX
     * -----------------------------------------
     *
     * IMPORTANT:
     *
     * This deletes only the "products" index.
     *
     * It does NOT delete:
     * - OpenSearch collection
     * - VPC endpoint
     * - Security group
     * - Network policy
     * - Access policy
     * - DynamoDB table
     * - Lambda
     *
     * DynamoDB remains the source of truth.
     *
     * This method is temporary and should be
     * removed after the incorrect index has
     * been deleted and recreated.
     * -----------------------------------------
     */
    async deleteIndex() {
        console.log(`Attempting to delete OpenSearch index: ${this.indexName}`);
        try {
            await this.client.indices.delete({
                index: this.indexName,
            });
            console.log(`OpenSearch index deleted successfully: ${this.indexName}`);
            /*
             * Reset the initialization state.
             *
             * If the same Lambda container continues
             * running, the next upsert/search can
             * recreate the index using the correct
             * mapping.
             */
            this.indexReady =
                undefined;
        }
        catch (error) {
            /*
             * 404 means the index does not exist.
             */
            if (error?.statusCode === 404) {
                console.log(`OpenSearch index does not exist: ${this.indexName}`);
                this.indexReady =
                    undefined;
                return;
            }
            console.error("OpenSearch index deletion failed");
            console.error("Error name:", error?.name);
            console.error("Error message:", error?.message);
            console.error("Error status code:", error?.statusCode);
            console.error("Error body:", JSON.stringify(error?.body));
            console.error("Error meta:", JSON.stringify(error?.meta));
            throw error;
        }
    }
    /*
     * -----------------------------------------
     * Upsert product
     * -----------------------------------------
     */
    async upsert(document) {
        await this.ensureIndex();
        console.log(`OpenSearch upsert started. Product ID=${document.productId}`);
        try {
            const response = await this.client.index({
                index: this.indexName,
                body: {
                    productId: document.productId,
                    sku: document.sku,
                    name: document.name,
                    brand: document.brand,
                    category: document.category,
                    price: document.price,
                    embedding: document.embedding,
                    searchableText: document.searchableText,
                    metadata: document.metadata,
                },
            });
            console.log(`OpenSearch upsert successful. Product ID=${document.productId}`);
            console.log(`OpenSearch response: ${JSON.stringify(response.body)}`);
        }
        catch (error) {
            console.error(`OpenSearch upsert failed for product ${document.productId}`);
            console.error("Error name:", error?.name);
            console.error("Error message:", error?.message);
            console.error("Error status code:", error?.statusCode);
            console.error("Error body:", JSON.stringify(error?.body));
            console.error("Error meta:", JSON.stringify(error?.meta));
            throw error;
        }
    }
    /*
     * -----------------------------------------
     * Vector search
     * -----------------------------------------
     */
    async search(embedding, options) {
        await this.ensureIndex();
        const limit = options?.limit ?? 10;
        console.log(`OpenSearch vector search started. limit=${limit}`);
        console.log(`Embedding dimensions=${embedding.length}`);
        const response = await this.client.search({
            index: this.indexName,
            body: {
                size: limit,
                query: {
                    knn: {
                        embedding: {
                            vector: embedding,
                            k: limit,
                        },
                    },
                },
            },
        });
        const hits = response.body.hits?.hits ?? [];
        console.log(`OpenSearch vector search returned ${hits.length} results`);
        return hits.map((hit) => hit._source);
    }
    /*
     * -----------------------------------------
     * Delete individual product
     * -----------------------------------------
     */
    async delete(productId) {
        try {
            await this.client.delete({
                index: this.indexName,
                id: String(productId),
            });
        }
        catch (error) {
            if (error?.statusCode === 404) {
                return;
            }
            throw error;
        }
    }
}
exports.OpenSearchVectorStore = OpenSearchVectorStore;
