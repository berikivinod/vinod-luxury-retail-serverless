import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

export interface DynamoDBProduct {
  id: number;

  sku?: string;

  name: string;

  brand: string;

  category: string;

  price: number;

  description?: string;

  image?: string;
}

export class ProductRepository {

  private readonly client: DynamoDBDocumentClient;

  private readonly tableName: string;

  constructor() {

    const tableName =
      process.env.PRODUCTS_TABLE_NAME;

    if (!tableName) {
      throw new Error(
        "PRODUCTS_TABLE_NAME environment variable is not configured"
      );
    }

    this.tableName = tableName;

    const dynamoClient =
      new DynamoDBClient({
        region:
          process.env.AWS_REGION ?? "us-east-2",
      });

    this.client =
      DynamoDBDocumentClient.from(
        dynamoClient
      );
  }

  async getAllProducts(): Promise<DynamoDBProduct[]> {

    const products: DynamoDBProduct[] = [];

    let exclusiveStartKey:
      Record<string, unknown> | undefined;

    do {

      const response =
        await this.client.send(
          new ScanCommand({
            TableName: this.tableName,

            ExclusiveStartKey:
              exclusiveStartKey,
          })
        );

      const items =
        response.Items ?? [];

      for (const item of items) {

        const product =
          this.toProduct(item);

        products.push(product);
      }

      exclusiveStartKey =
        response.LastEvaluatedKey;

    } while (exclusiveStartKey);

    return products;
  }

  private toProduct(
    item: Record<string, unknown>
  ): DynamoDBProduct {

    if (
      typeof item.id !== "number" ||
      typeof item.name !== "string" ||
      typeof item.brand !== "string" ||
      typeof item.category !== "string" ||
      typeof item.price !== "number"
    ) {
      throw new Error(
        `Invalid product record: ${JSON.stringify(item)}`
      );
    }

    return {
      id: item.id,

      sku:
        typeof item.sku === "string"
          ? item.sku
          : undefined,

      name: item.name,

      brand: item.brand,

      category: item.category,

      price: item.price,

      description:
        typeof item.description === "string"
          ? item.description
          : undefined,

      image:
        typeof item.image === "string"
          ? item.image
          : undefined,
    };
  }
}