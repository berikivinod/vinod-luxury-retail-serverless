import OpenAI from "openai";

import type {
  EmbeddingProvider,
} from "./embeddingProvider";

export class OpenAIEmbeddingProvider
  implements EmbeddingProvider {

  private readonly client: OpenAI;

  private readonly model =
    "text-embedding-3-small";

  constructor() {

    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {

      throw new Error(
        "OPENAI_API_KEY environment variable is not configured"
      );
    }

    this.client =
      new OpenAI({
        apiKey,
      });
  }

  async createEmbedding(
    text: string
  ): Promise<number[]> {

    const response =
      await this.client.embeddings.create({

        model:
          this.model,

        input:
          text,
      });

    const embedding =
      response.data[0]?.embedding;

    if (!embedding) {

      throw new Error(
        "OpenAI did not return an embedding"
      );
    }

    if (embedding.length !== 1536) {

      throw new Error(
        `Expected 1536-dimensional embedding, received ${embedding.length}`
      );
    }

    return embedding;
  }
}