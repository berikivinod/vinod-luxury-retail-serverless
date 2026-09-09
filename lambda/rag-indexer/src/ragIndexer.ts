import type {
  RAGIndexDocument,
} from "./ragIndexDocument";

import type {
  EmbeddingProvider,
} from "./embeddingProvider";

import type {
  VectorStore,
} from "./vectorStore";

import type {
  DynamoDBProduct,
} from "./productRepository";

export class RAGIndexer {

  constructor(
    private readonly embeddingProvider:
      EmbeddingProvider,

    private readonly vectorStore:
      VectorStore
  ) {}

  async indexProduct(
    product: DynamoDBProduct
  ): Promise<RAGIndexDocument> {

    const searchableText =
      this.buildSearchableText(product);

    console.log(
      `Creating embedding for product ${product.id}: ${product.name}`
    );

    const embedding =
      await this.embeddingProvider
        .createEmbedding(
          searchableText
        );

    if (embedding.length !== 1536) {

      throw new Error(
        `Expected 1536-dimensional embedding, received ${embedding.length}`
      );
    }

    const document: RAGIndexDocument = {

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

    await this.vectorStore.upsert(
      document
    );

    console.log(
      `Product ${product.id} indexed successfully`
    );

    return document;
  }

  private buildSearchableText(
    product: DynamoDBProduct
  ): string {

    return [
      product.name,
      product.brand,
      product.category,
      product.description,
      product.sku,
    ]
      .filter(
        (
          value
        ): value is string =>
          Boolean(value)
      )
      .join(" ");
  }
}