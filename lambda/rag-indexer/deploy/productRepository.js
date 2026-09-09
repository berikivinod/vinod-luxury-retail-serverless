"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class ProductRepository {
    client;
    tableName;
    constructor() {
        const tableName = process.env.PRODUCTS_TABLE_NAME;
        if (!tableName) {
            throw new Error("PRODUCTS_TABLE_NAME environment variable is not configured");
        }
        this.tableName = tableName;
        const dynamoClient = new client_dynamodb_1.DynamoDBClient({
            region: process.env.AWS_REGION ?? "us-east-2",
        });
        this.client =
            lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoClient);
    }
    async getAllProducts() {
        const products = [];
        let exclusiveStartKey;
        do {
            const response = await this.client.send(new lib_dynamodb_1.ScanCommand({
                TableName: this.tableName,
                ExclusiveStartKey: exclusiveStartKey,
            }));
            const items = response.Items ?? [];
            for (const item of items) {
                const product = this.toProduct(item);
                products.push(product);
            }
            exclusiveStartKey =
                response.LastEvaluatedKey;
        } while (exclusiveStartKey);
        return products;
    }
    toProduct(item) {
        if (typeof item.id !== "number" ||
            typeof item.name !== "string" ||
            typeof item.brand !== "string" ||
            typeof item.category !== "string" ||
            typeof item.price !== "number") {
            throw new Error(`Invalid product record: ${JSON.stringify(item)}`);
        }
        return {
            id: item.id,
            sku: typeof item.sku === "string"
                ? item.sku
                : undefined,
            name: item.name,
            brand: item.brand,
            category: item.category,
            price: item.price,
            description: typeof item.description === "string"
                ? item.description
                : undefined,
            image: typeof item.image === "string"
                ? item.image
                : undefined,
        };
    }
}
exports.ProductRepository = ProductRepository;
