import {
  Client,
} from "@opensearch-project/opensearch";

import {
  AwsSigv4Signer,
} from "@opensearch-project/opensearch/aws";

import {
  defaultProvider,
} from "@aws-sdk/credential-provider-node";

import type {
  VectorSearchFilters,
  VectorSearchResult,
  VectorStore,
} from "./vectorStore";


export class OpenSearchVectorStore
  implements VectorStore {

  private readonly client: Client;

  private readonly indexName =
    "products";


  constructor() {

    const endpoint =
      process.env.OPENSEARCH_ENDPOINT;

    if (!endpoint) {

      throw new Error(
        "OPENSEARCH_ENDPOINT environment variable is not configured"
      );
    }


    const region =
      process.env.AWS_REGION ?? "us-east-2";


    console.log(
      `Initializing OpenSearch Serverless client. Region=${region}`
    );


    console.log(
      `OpenSearch endpoint=${endpoint}`
    );


    this.client =
      new Client({

        ...AwsSigv4Signer({

          region,

          service: "aoss",

          getCredentials:
            defaultProvider(),

        }),

        node:
          endpoint,

      });
  }


  /*
   * -----------------------------------------
   * Get OpenSearch index mapping
   * -----------------------------------------
   */

  async getMapping(): Promise<any> {

    try {

      console.log(
        `Getting mapping for index=${this.indexName}`
      );


      const response =
        await this.client.indices.getMapping({

          index:
            this.indexName,

        });


      console.log(
        "========== PRODUCTS INDEX MAPPING =========="
      );


      console.log(
        JSON.stringify(
          response.body,
          null,
          2
        )
      );


      console.log(
        "============================================="
      );


      return response.body;

    } catch (error: any) {

      console.error(
        "Failed to retrieve products index mapping"
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


      throw error;
    }
  }


  /*
   * -----------------------------------------
   * Vector Search
   * -----------------------------------------
   *
   * Performs:
   *
   *   1. Semantic vector search
   *   2. Optional exact brand filter
   *   3. Optional exact category filter
   *   4. Optional maximum price filter
   *
   * Brand and category use their keyword fields
   * for exact matching.
   *
   * Returns the OpenSearch similarity score.
   *
   * -----------------------------------------
   */

  async search(

    embedding: number[],

    options?: {

      limit?: number;

      filters?: VectorSearchFilters;

    }

  ): Promise<VectorSearchResult[]> {


    const limit =
      Math.min(

        Math.max(

          options?.limit ?? 5,

          1

        ),

        10

      );


    const filters =
      options?.filters;


    console.log(
      `Searching OpenSearch index=${this.indexName}`
    );


    console.log(
      `Search limit=${limit}`
    );


    console.log(
      `Embedding dimensions=${embedding.length}`
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
        `Expected 1536-dimensional embedding, received ${embedding.length}`
      );
    }


    /*
     * -----------------------------------------
     * Build metadata filters
     * -----------------------------------------
     */

    const filterClauses: any[] = [];


    /*
     * -----------------------------------------
     * Brand filter
     *
     * Exact match using brand.keyword
     * -----------------------------------------
     */

    if (
      filters?.brand?.trim()
    ) {

      const brand =
        filters.brand.trim();


      console.log(
        `Applying exact brand filter=${brand}`
      );


      filterClauses.push({

        term: {

          "brand.keyword":
            brand,

        },

      });
    }


    /*
     * -----------------------------------------
     * Category filter
     *
     * Exact match using category.keyword
     * -----------------------------------------
     */

    if (
      filters?.category?.trim()
    ) {

      const category =
        filters.category.trim();


      console.log(
        `Applying exact category filter=${category}`
      );


      filterClauses.push({

        term: {

          "category.keyword":
            category,

        },

      });
    }


    /*
     * -----------------------------------------
     * Maximum price filter
     * -----------------------------------------
     */

    if (
      filters?.maxPrice !== undefined
    ) {

      if (
        !Number.isFinite(
          filters.maxPrice
        )
      ) {

        throw new Error(
          "maxPrice filter must be a valid number"
        );
      }


      if (
        filters.maxPrice < 0
      ) {

        throw new Error(
          "maxPrice filter cannot be negative"
        );
      }


      console.log(
        `Applying maximum price filter=${filters.maxPrice}`
      );


      filterClauses.push({

        range: {

          price: {

            lte:
              filters.maxPrice,

          },

        },

      });
    }


    /*
     * -----------------------------------------
     * Build k-NN query
     * -----------------------------------------
     *
     * Keep the k-NN query itself simple.
     * Filters are applied outside the k-NN
     * query using a bool query.
     *
     * -----------------------------------------
     */

    const knnQuery = {

      knn: {

        embedding: {

          vector:
            embedding,

          k:
            limit,

        },

      },

    };


    /*
     * -----------------------------------------
     * Build final query
     * -----------------------------------------
     *
     * No filters:
     *
     *   query
     *     └── knn
     *
     *
     * With filters:
     *
     *   query
     *     └── bool
     *          ├── must
     *          │    └── knn
     *          │
     *          └── filter
     *               └── bool
     *                    └── must
     *                         ├── brand.keyword
     *                         ├── category.keyword
     *                         └── price
     *
     * -----------------------------------------
     */

    let query: any;


    if (
      filterClauses.length === 0
    ) {

      query =
        knnQuery;

    } else {

      query = {

        bool: {

          must: [

            knnQuery,

          ],

          filter: {

            bool: {

              must:
                filterClauses,

            },

          },

        },

      };
    }


    /*
     * -----------------------------------------
     * Execute OpenSearch search
     * -----------------------------------------
     */

    try {

      console.log(
        "Executing OpenSearch vector search"
      );


      const response =
        await this.client.search({

          index:
            this.indexName,

          body: {

            size:
              limit,

            query,

          },

        });


      console.log(
        "OpenSearch vector search successful"
      );


      const hits =
        response.body.hits?.hits ?? [];


      console.log(
        `OpenSearch returned ${hits.length} results`
      );


      /*
       * -----------------------------------------
       * Convert OpenSearch results
       * -----------------------------------------
       */

      const results =
        hits.map(
          (hit: any): VectorSearchResult => {

            const source =
              hit._source as any;


            return {

              productId:
                source.productId,

              sku:
                source.sku,

              name:
                source.name,

              brand:
                source.brand,

              category:
                source.category,

              price:
                source.price,

              embedding:
                source.embedding,

              searchableText:
                source.searchableText,

              metadata:
                source.metadata,

              score:
                Number(
                  hit._score ?? 0
                ),

            };

          }
        );


      /*
       * -----------------------------------------
       * Log retrieved products
       *
       * Do NOT log embeddings.
       * -----------------------------------------
       */

      console.log(
        "========== VECTOR SEARCH RESULTS =========="
      );


      results.forEach(
        (
          product: VectorSearchResult,
          index: number
        ) => {

          console.log({

            rank:
              index + 1,

            productId:
              product.productId,

            name:
              product.name,

            brand:
              product.brand,

            category:
              product.category,

            price:
              product.price,

            score:
              product.score,

          });

        }
      );


      console.log(
        "============================================"
      );


      return results;


    } catch (error: any) {

      console.error(
        "========== OPENSEARCH SEARCH ERROR =========="
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


      throw error;
    }
  }
}