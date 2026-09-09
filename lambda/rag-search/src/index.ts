import type {
  Handler,
} from "aws-lambda";

import {
  OpenAIEmbeddingProvider,
} from "./openaiEmbeddingProvider";

import {
  OpenSearchVectorStore,
} from "./openSearchVectorStore";

interface SearchRequest {
  query?: string;
  limit?: number;
}

interface SearchProduct {
  productId: number;
  sku?: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  searchableText?: string;
  metadata?: Record<string, unknown>;
}

export const handler: Handler =
  async (event) => {

    console.log(
      "=============================================="
    );

    console.log(
      "VLR RAG Search Lambda started"
    );

    console.log(
      "=============================================="
    );

    console.log(
      "Incoming event:",
      JSON.stringify(event)
    );

    try {

      /*
       * -----------------------------------------
       * Parse request
       * -----------------------------------------
       */

      let request: SearchRequest = {};

      if (
        typeof event?.body === "string"
      ) {

        try {

          request =
            JSON.parse(
              event.body
            );

        } catch {

          return {

            statusCode: 400,

            body:
              JSON.stringify({

                message:
                  "Request body contains invalid JSON",

              }),
          };
        }

      } else if (
        event?.body &&
        typeof event.body === "object"
      ) {

        request =
          event.body as SearchRequest;

      } else {

        request =
          event as SearchRequest;
      }

      /*
       * -----------------------------------------
       * Validate query
       * -----------------------------------------
       */

      const query =
        request.query?.trim();

      if (!query) {

        console.error(
          "Search query is missing"
        );

        return {

          statusCode: 400,

          body:
            JSON.stringify({

              message:
                "query is required",

              example: {
                query:
                  "premium leather shoes",

                limit:
                  5,
              },
            }),
        };
      }

      /*
       * -----------------------------------------
       * Validate result limit
       * -----------------------------------------
       */

      const requestedLimit =
        request.limit ?? 5;

      const limit =
        Math.min(
          Math.max(
            Number(requestedLimit),
            1
          ),
          20
        );

      console.log(
        `Search query: ${query}`
      );

      console.log(
        `Search limit: ${limit}`
      );

      /*
       * -----------------------------------------
       * Create OpenAI embedding provider
       * -----------------------------------------
       */

      console.log(
        "Initializing OpenAI embedding provider"
      );

      const embeddingProvider =
        new OpenAIEmbeddingProvider();

      /*
       * -----------------------------------------
       * Create OpenSearch vector store
       * -----------------------------------------
       */

      console.log(
        "Initializing OpenSearch vector store"
      );

      const vectorStore =
        new OpenSearchVectorStore();

      /*
       * -----------------------------------------
       * Create embedding for user query
       * -----------------------------------------
       */

      console.log(
        "Creating embedding for search query"
      );

      const embedding =
        await embeddingProvider
          .createEmbedding(query);

      console.log(
        `Query embedding created successfully. Dimensions=${embedding.length}`
      );

      /*
       * -----------------------------------------
       * Validate embedding dimensions
       * -----------------------------------------
       */

      if (
        embedding.length !== 1536
      ) {

        throw new Error(
          `Expected 1536-dimensional query embedding, received ${embedding.length}`
        );
      }

      /*
       * -----------------------------------------
       * Perform OpenSearch k-NN search
       * -----------------------------------------
       */

      console.log(
        "Executing OpenSearch k-NN search"
      );

      const products =
        await vectorStore.search(

          embedding,

          {
            limit,
          }

        );

      console.log(
        `OpenSearch returned ${products.length} products`
      );

      /*
       * -----------------------------------------
       * Remove embeddings from API response
       * -----------------------------------------
       *
       * The embedding is used internally for
       * vector similarity search.
       *
       * It should NOT be returned to the caller.
       * -----------------------------------------
       */

      const results:
        SearchProduct[] =
        products.map(
          (product) => ({

            productId:
              product.productId,

            sku:
              product.sku,

            name:
              product.name,

            brand:
              product.brand,

            category:
              product.category,

            price:
              product.price,

            searchableText:
              product.searchableText,

            metadata:
              product.metadata,

          })
        );

      /*
       * -----------------------------------------
       * Return clean search response
       * -----------------------------------------
       */

      return {

        statusCode: 200,

        body:
          JSON.stringify({

            message:
              "VLR RAG vector search completed",

            query,

            limit,

            count:
              results.length,

            products:
              results,

          }),
      };

    } catch (error: any) {

      /*
       * -----------------------------------------
       * Detailed error logging
       * -----------------------------------------
       */

      console.error(
        "=============================================="
      );

      console.error(
        "VLR RAG vector search failed"
      );

      console.error(
        "=============================================="
      );

      console.error(
        "Error name:",
        error?.name
      );

      console.error(
        "Error message:",
        error?.message
      );

      console.error(
        "Error status code:",
        error?.statusCode
      );

      console.error(
        "Error body:",
        JSON.stringify(
          error?.body
        )
      );

      console.error(
        "Error meta:",
        JSON.stringify(
          error?.meta
        )
      );

      console.error(
        "Error response:",
        JSON.stringify(
          error?.response
        )
      );

      console.error(
        "Full error:",
        JSON.stringify(
          error
        )
      );

      console.error(
        "=============================================="
      );

      return {

        statusCode: 500,

        body:
          JSON.stringify({

            message:
              "VLR RAG vector search failed",

            error:
              error?.message ??
              String(error),

            statusCode:
              error?.statusCode,

            errorBody:
              error?.body,

            errorMeta:
              error?.meta,

          }),
      };
    }
  };