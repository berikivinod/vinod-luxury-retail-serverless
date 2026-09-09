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
  RAGIndexDocument,
} from "./ragIndexDocument";

import type {
  VectorSearchFilters,
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
   * TEMPORARY DIAGNOSTIC
   *
   * Get the mapping of the existing
   * "products" index.
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
        JSON.stringify(error?.body)
      );

      console.error(
        "Error meta:",
        JSON.stringify(error?.meta)
      );

      throw error;
    }
  }

  /*
   * -----------------------------------------
   * Vector Search
   * -----------------------------------------
   */

  async search(
    embedding: number[],
    options?: {
      limit?: number;
      filters?: VectorSearchFilters;
    }
  ): Promise<RAGIndexDocument[]> {

    const limit =
      options?.limit ?? 5;

    console.log(
      `Searching OpenSearch index=${this.indexName}`
    );

    console.log(
      `Search limit=${limit}`
    );

    console.log(
      `Embedding dimensions=${embedding.length}`
    );

    try {

      const response =
        await this.client.search({

          index:
            this.indexName,

          body: {

            size:
              limit,

            query: {

              knn: {

                embedding: {

                  vector:
                    embedding,

                  k:
                    limit,
                },
              },
            },
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

      return hits.map(
        (hit: any) =>
          hit._source as RAGIndexDocument
      );

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
        JSON.stringify(error?.body)
      );

      console.error(
        "Error meta:",
        JSON.stringify(error?.meta)
      );

      console.error(
        "Error response:",
        JSON.stringify(error?.response)
      );

      console.error(
        "Error meta.body:",
        JSON.stringify(error?.meta?.body)
      );

      console.error(
        "Full error:",
        JSON.stringify(error)
      );

      console.error(
        "=============================================="
      );

      throw error;
    }
  }
}