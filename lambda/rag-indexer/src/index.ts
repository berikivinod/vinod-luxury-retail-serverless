import type {
  Handler,
} from "aws-lambda";

import {
  ProductRepository,
} from "./productRepository";

import {
  OpenAIEmbeddingProvider,
} from "./openaiEmbeddingProvider";

import {
  OpenSearchVectorStore,
} from "./openSearchVectorStore";

import {
  RAGIndexer,
} from "./ragIndexer";

export const handler: Handler =
  async () => {

    console.log(
      "VLR RAG Indexer Lambda started"
    );

    try {

      const productRepository =
        new ProductRepository();

      const embeddingProvider =
        new OpenAIEmbeddingProvider();

      const vectorStore =
        new OpenSearchVectorStore();

      const ragIndexer =
        new RAGIndexer(
          embeddingProvider,
          vectorStore
        );

      const products =
        await productRepository
          .getAllProducts();

      console.log(
        `Retrieved ${products.length} products from DynamoDB`
      );

      let indexed = 0;

      let failed = 0;

      const failures: Array<{
        productId: number;
        error: string;
      }> = [];

      for (const product of products) {

        try {

          const document =
            await ragIndexer
              .indexProduct(product);

          indexed++;

          console.log(
            `Indexed product ${document.productId}: ${document.name}`
          );

        } catch (error) {

          failed++;

          const message =
            error instanceof Error
              ? error.message
              : String(error);

          failures.push({
            productId: product.id,
            error: message,
          });

          console.error(
            `Failed to index product ${product.id}`,
            error
          );
        }
      }

      console.log(
        `RAG indexing complete. Total=${products.length}, Indexed=${indexed}, Failed=${failed}`
      );

      return {

        statusCode:
          failed === 0 ? 200 : 500,

        body: JSON.stringify({

          message:
            "VLR RAG indexing completed",

          totalProducts:
            products.length,

          indexed,

          failed,

          failures,
        }),
      };

    } catch (error) {

      console.error(
        "RAG indexing failed",
        error
      );

      return {

        statusCode: 500,

        body: JSON.stringify({

          message:
            "RAG indexing failed",

          error:
            error instanceof Error
              ? error.message
              : String(error),
        }),
      };
    }
  };