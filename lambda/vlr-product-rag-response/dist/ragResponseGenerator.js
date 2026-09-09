"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGResponseGenerator = void 0;
const openai_1 = __importDefault(require("openai"));
class RAGResponseGenerator {
    client;
    model = "gpt-4o-mini";
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
    async generateResponse(query, products) {
        /*
         * -----------------------------------------
         * Handle no retrieved products
         * -----------------------------------------
         */
        if (products.length === 0) {
            console.log("No products retrieved. Skipping OpenAI response generation.");
            return ("No suitable matching product was found.");
        }
        console.log(`Generating response using ${products.length} retrieved products`);
        /*
         * -----------------------------------------
         * Build product context
         * -----------------------------------------
         */
        const productContext = products
            .map((product, index) => {
            return [
                `Product ${index + 1}:`,
                `Product ID: ${product.productId}`,
                `SKU: ${product.sku ?? "N/A"}`,
                `Name: ${product.name}`,
                `Brand: ${product.brand}`,
                `Category: ${product.category}`,
                `Price: $${product.price}`,
                `Description: ${product.searchableText ?? "N/A"}`,
            ].join("\n");
        })
            .join("\n\n");
        /*
         * -----------------------------------------
         * Grounding instructions
         * -----------------------------------------
         */
        const instructions = `
You are the VLR luxury fashion shopping assistant.

Answer the customer's question using ONLY the
products provided in the product context.

IMPORTANT RULES:

1. Do not invent products.
2. Do not invent product names.
3. Do not invent prices.
4. Do not invent brands.
5. Do not claim availability unless it is explicitly
   provided in the product context.
6. Do not introduce product information that is not
   present in the product context.
7. If the retrieved products do not adequately answer
   the customer's question, clearly say that no suitable
   matching product was found.
8. Be concise and helpful.
9. When recommending products, mention the product name,
   brand, and price when available.
10. Do not mention embeddings, vector search, OpenSearch,
    RAG, or internal implementation details.

Answer as a luxury fashion shopping assistant for VLR.
`;
        /*
         * -----------------------------------------
         * Build model input
         * -----------------------------------------
         */
        const input = `
Customer question:

${query}


Retrieved product context:

${productContext}
`;
        console.log(`Generating response using model=${this.model}`);
        /*
         * -----------------------------------------
         * OpenAI Responses API
         * -----------------------------------------
         */
        const response = await this.client.responses.create({
            model: this.model,
            instructions,
            input,
        });
        console.log("OpenAI response generated successfully");
        /*
         * -----------------------------------------
         * Extract answer
         * -----------------------------------------
         */
        const answer = response.output_text?.trim();
        if (!answer) {
            throw new Error("OpenAI did not return a text response");
        }
        return answer;
    }
}
exports.RAGResponseGenerator = RAGResponseGenerator;
