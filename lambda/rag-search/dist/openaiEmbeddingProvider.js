"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIEmbeddingProvider = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIEmbeddingProvider {
    client;
    model = "text-embedding-3-small";
    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("OPENAI_API_KEY environment variable is not configured");
        }
        this.client =
            new openai_1.default({
                apiKey,
            });
    }
    async createEmbedding(text) {
        const response = await this.client.embeddings.create({
            model: this.model,
            input: text,
        });
        const embedding = response.data[0]?.embedding;
        if (!embedding) {
            throw new Error("OpenAI did not return an embedding");
        }
        if (embedding.length !== 1536) {
            throw new Error(`Expected 1536-dimensional embedding, received ${embedding.length}`);
        }
        return embedding;
    }
}
exports.OpenAIEmbeddingProvider = OpenAIEmbeddingProvider;
